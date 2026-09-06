'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, Check, Handshake, Link2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Application = {
  company: string;
  contact: string;
  email: string;
  productUrl: string;
  network: string;
  evidence: string;
};

type ModelContext = {
  registerTool: (tool: Record<string, unknown>, options?: { signal?: AbortSignal }) => void | Promise<void>;
};

declare global {
  interface Document { modelContext?: ModelContext }
}

const blank: Application = { company: '', contact: '', email: '', productUrl: '', network: '', evidence: '' };

function validate(application: Application) {
  if (!application.company.trim()) throw new Error('Company is required.');
  if (!/^\S+@\S+\.\S+$/.test(application.email)) throw new Error('A valid email is required.');
  if (!/^https?:\/\//.test(application.productUrl)) throw new Error('Product URL must start with http:// or https://.');
}

export function PartnerForm() {
  const [form, setForm] = useState<Application>(blank);
  const [submitted, setSubmitted] = useState<Application | null>(null);
  const [error, setError] = useState('');

  function save(application: Application) {
    validate(application);
    const record = { ...application, id: `GS-${Date.now().toString(36).toUpperCase()}`, submittedAt: new Date().toISOString(), status: 'Product review' };
    const existing = JSON.parse(window.localStorage.getItem('greenswap-partner-applications') || '[]');
    window.localStorage.setItem('greenswap-partner-applications', JSON.stringify([...existing, record]));
    setSubmitted(application);
    setError('');
    return record;
  }

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(context.registerTool({
        name: 'submit_greenswap_partner_application',
        title: 'Submit GreenSwap partner application',
        description: 'Submit a brand product for independent environmental review and possible affiliate partnership.',
        inputSchema: {
          type: 'object',
          properties: {
            company: { type: 'string' }, contact: { type: 'string' }, email: { type: 'string' },
            productUrl: { type: 'string' }, network: { type: 'string' }, evidence: { type: 'string' },
          },
          required: ['company', 'email', 'productUrl'], additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: true },
        execute(input: unknown) {
          const application = { ...blank, ...(input as Partial<Application>) };
          const record = save(application);
          return { id: record.id, status: record.status, company: record.company };
        },
      }, { signal: lifecycle.signal })).catch(() => undefined);
    } catch { /* Optional browser capability. The visible form still works. */ }
    return () => lifecycle.abort();
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try { save(form); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Check the form and try again.'); }
  }

  if (submitted) {
    return (
      <div className="application-success" role="status">
        <span><Check /></span>
        <div><p className="kicker">Application received locally</p><h3>Thanks, {submitted.company}.</h3><p>Your product is now in the demo review queue. No placement is promised: GreenSwap will evaluate the evidence before discussing an affiliate relationship.</p></div>
        <Button variant="outline" onClick={() => { setSubmitted(null); setForm(blank); }}>Submit another product</Button>
      </div>
    );
  }

  return (
    <form className="partner-form" onSubmit={submit}>
      <div className="field-pair"><label>Company<Input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="LeafClean" /></label><label>Your name<Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Jordan Lee" /></label></div>
      <label>Work email<Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jordan@company.com" /></label>
      <label>Product URL<Input required type="url" value={form.productUrl} onChange={(e) => setForm({ ...form, productUrl: e.target.value })} placeholder="https://company.com/product" /></label>
      <label>Existing affiliate program<Input value={form.network} onChange={(e) => setForm({ ...form, network: e.target.value })} placeholder="Impact, Awin, direct program, or none" /></label>
      <label>Certifications or supporting evidence<Textarea value={form.evidence} onChange={(e) => setForm({ ...form, evidence: e.target.value })} placeholder="EPA Safer Choice record, ingredient disclosure, packaging specification…" /></label>
      {error && <p className="form-error">{error}</p>}
      <div className="form-submit"><p><ShieldCheck /> Affiliate status never changes the environmental score.</p><Button type="submit" size="lg">Submit for review <ArrowRight /></Button></div>
    </form>
  );
}

export function PartnerSection() {
  return (
    <section className="partner-section" id="partners">
      <div className="partner-intro">
        <span className="kicker">For responsible brands</span><h2>Earn a place in the comparison—not a better score.</h2>
        <p>Submit a product, its documentation, and your existing affiliate program. GreenSwap evaluates the product first. If it qualifies, we connect the approved tracking link afterward.</p>
        <div className="partner-steps">
          <div><span><Link2 /></span><strong>1. Share the product</strong><p>Send the exact URL, certification, materials, and packaging evidence.</p></div>
          <div><span><ShieldCheck /></span><strong>2. Independent review</strong><p>The same environmental rules apply to partner and non-partner products.</p></div>
          <div><span><Handshake /></span><strong>3. Connect tracking</strong><p>If it qualifies, we join your network or arrange a direct tracked partnership.</p></div>
        </div>
        <aside><strong>Our ranking promise</strong><p>A partner may be preferred only among closely comparable products. Commission never changes the environmental score shown to shoppers.</p></aside>
      </div>
      <PartnerForm />
    </section>
  );
}
