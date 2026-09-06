'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ExternalLink,
  FlaskConical,
  Leaf,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PartnerSection } from '@/components/partner-form';

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  score: number;
  confidence: string;
  emoji: string;
  summary: string;
  dimensions: { label: string; score: number; max: number }[];
  evidence: { claim: string; source: string; level: string }[];
  alternative: {
    name: string;
    price: number;
    score: number;
    confidence: string;
    affiliate: boolean;
    certification: string;
    reasons: string[];
  } | null;
};

const products: Product[] = [
  {
    id: 'soap', name: 'Ultra Clean Dish Soap, 40oz', brand: 'SudStar', price: 4.49,
    score: 42, confidence: 'Medium confidence', emoji: '🧴',
    summary: 'A conventional formula in a single-use plastic bottle, with incomplete ingredient disclosure.',
    dimensions: [
      { label: 'Ingredient safety', score: 15, max: 35 }, { label: 'Packaging', score: 8, max: 25 },
      { label: 'Concentration', score: 8, max: 15 }, { label: 'Environmental fate', score: 7, max: 15 },
      { label: 'Certification', score: 4, max: 10 },
    ],
    evidence: [
      { claim: '40oz single-use plastic bottle', source: 'Retailer listing', level: 'Extracted' },
      { claim: 'Added fragrance and synthetic surfactants', source: 'Product details', level: 'Documented' },
      { claim: 'No EPA Safer Choice product match', source: 'EPA product list', level: 'Verified' },
    ],
    alternative: {
      name: 'Plant-Based Dish Soap, 40oz', price: 3.99, score: 93, confidence: 'High confidence', affiliate: true,
      certification: 'EPA Safer Choice', reasons: ['Product certification verified', 'Lower price per ounce', 'Ingredients reviewed'],
    },
  },
  {
    id: 'bottles', name: 'Disposable Water Bottles, 24 Pack', brand: 'HydroBasic', price: 12.99,
    score: 18, confidence: 'High confidence', emoji: '💧',
    summary: 'Twenty-four single-use PET bottles plus shrink-wrap packaging create avoidable material waste.',
    dimensions: [
      { label: 'Material impact', score: 5, max: 30 }, { label: 'Packaging', score: 3, max: 25 },
      { label: 'Reuse potential', score: 0, max: 25 }, { label: 'End of life', score: 8, max: 15 },
      { label: 'Certification', score: 2, max: 5 },
    ],
    evidence: [
      { claim: '24 PET bottles per case', source: 'Retailer listing', level: 'Verified' },
      { claim: 'Plastic film outer wrap', source: 'Packaging image', level: 'Extracted' },
      { claim: 'Designed for single use', source: 'Product format', level: 'Verified' },
    ],
    alternative: {
      name: 'Stainless Steel Bottle, 24oz', price: 9.99, score: 91, confidence: 'High confidence', affiliate: false,
      certification: 'Material verified', reasons: ['Reusable for years', 'No price premium', 'Recyclable steel'],
    },
  },
  {
    id: 'already-green', name: 'Refillable Cleaning Concentrate', brand: 'BrightDrop', price: 6.25,
    score: 89, confidence: 'High confidence', emoji: '🌱',
    summary: 'A concentrated refill with strong ingredient disclosure and very little single-use packaging.',
    dimensions: [
      { label: 'Ingredient safety', score: 32, max: 35 }, { label: 'Packaging', score: 22, max: 25 },
      { label: 'Concentration', score: 14, max: 15 }, { label: 'Environmental fate', score: 13, max: 15 },
      { label: 'Certification', score: 8, max: 10 },
    ],
    evidence: [
      { claim: 'Full ingredient list disclosed', source: 'Manufacturer SDS', level: 'Verified' },
      { claim: 'Makes four full bottles', source: 'Package directions', level: 'Documented' },
      { claim: 'Paper-based refill packaging', source: 'Packaging image', level: 'Extracted' },
    ],
    alternative: null,
  },
];

const stages = ['Identifying the exact product', 'Reading ingredients and packaging', 'Checking trusted certifications', 'Comparing price and environmental impact'];

export default function Home() {
  const [selectedId, setSelectedId] = useState(products[0].id);
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const [stage, setStage] = useState(0);
  const product = useMemo(() => products.find((item) => item.id === selectedId)!, [selectedId]);

  useEffect(() => { setStatus('idle'); setStage(0); }, [selectedId]);
  useEffect(() => {
    if (status !== 'running') return;
    if (stage >= stages.length) {
      const done = window.setTimeout(() => setStatus('done'), 320);
      return () => window.clearTimeout(done);
    }
    const next = window.setTimeout(() => setStage((value) => value + 1), 520);
    return () => window.clearTimeout(next);
  }, [status, stage]);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="GreenSwap home"><span className="brand-mark"><Leaf size={19} /></span><span>GreenSwap</span></a>
        <nav aria-label="Primary navigation"><a href="#demo">Live demo</a><a href="#method">How scoring works</a><a href="#partners">For brands</a></nav>
        <Button render={<a href="#partners" />} nativeButton={false} className="nav-cta">Partner with us</Button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> Clearer choices, while you shop</div>
          <h1>See what a product is <em>really</em> made of.</h1>
          <p>GreenSwap reads the evidence behind everyday products, scores their impact, and finds a greener option without raising your budget.</p>
          <div className="hero-actions"><Button render={<a href="#demo" />} nativeButton={false} size="lg">Try the live analysis <ArrowRight /></Button><a className="text-link" href="#method">Explore our methodology</a></div>
          <div className="trust-row"><span><BadgeCheck /> Evidence shown</span><span><ShieldCheck /> Scores stay independent</span><span><PackageCheck /> Price-aware swaps</span></div>
        </div>
        <div className="hero-proof" aria-label="Sample GreenSwap result">
          <div className="proof-top"><span>Analysis complete</span><span className="verified"><Check /> 4 verified facts</span></div>
          <div className="score-orbit"><div><strong>42</strong><span>/100</span></div><ArrowRight /><div className="better"><strong>93</strong><span>/100</span></div></div>
          <p><strong>A better swap is available.</strong><br />Stronger ingredients. Less waste. $0.50 less.</p>
          <div className="mini-evidence"><span>EPA Safer Choice</span><span>Same category</span><span>Lower price</span></div>
        </div>
      </section>

      <section className="demo-section" id="demo">
        <div className="section-heading"><div><span className="kicker">Working prototype</span><h2>Watch GreenSwap investigate a product.</h2></div><p>Choose a sample listing, then run the same evidence-first flow the extension uses while someone shops.</p></div>
        <div className="demo-shell">
          <aside className="product-picker">
            <span className="picker-label">Sample product page</span>
            {products.map((item) => (
              <button key={item.id} className={item.id === selectedId ? 'product-option active' : 'product-option'} onClick={() => setSelectedId(item.id)}>
                <span className="product-emoji">{item.emoji}</span><span><strong>{item.name}</strong><small>{item.brand} · ${item.price.toFixed(2)}</small></span><ChevronDown className="option-arrow" size={17} />
              </button>
            ))}
            <div className="listing-card"><span>Retailer listing</span><h3>{product.name}</h3><p>by {product.brand}</p><strong>${product.price.toFixed(2)}</strong></div>
          </aside>

          <div className="analysis-panel" aria-live="polite">
            <div className="panel-head"><div><span className="kicker">GreenSwap analysis</span><h3>{product.name}</h3></div>{status === 'done' && <span className="confidence"><ShieldCheck /> {product.confidence}</span>}</div>
            {status === 'idle' && (
              <div className="ready-state"><div className="scan-icon"><Search /></div><h3>Ready to inspect this listing</h3><p>We’ll identify the product, collect its evidence, calculate a category-specific score, and compare qualifying swaps.</p><Button size="lg" onClick={() => { setStage(0); setStatus('running'); }}><FlaskConical /> Analyze product</Button></div>
            )}
            {status === 'running' && (
              <div className="running-state"><div className="pulse-mark"><Leaf /></div><div><span className="kicker">Analyzing evidence</span><h3>{stages[Math.min(stage, stages.length - 1)]}</h3></div><Progress value={(stage / stages.length) * 100} /><ol>{stages.map((label, index) => <li key={label} className={index < stage ? 'complete' : index === stage ? 'current' : ''}><span>{index < stage ? <Check /> : index + 1}</span>{label}</li>)}</ol></div>
            )}
            {status === 'done' && (
              <div className="result-state">
                <div className="verdict-card"><div className="big-score"><strong>{product.score}</strong><span>/100</span></div><div><span className="kicker">This product</span><h3>{product.score >= 80 ? 'Already a strong choice' : 'There is room for a greener swap'}</h3><p>{product.summary}</p></div></div>
                <div className="score-grid">{product.dimensions.map((item) => <div className="score-row" key={item.label}><span>{item.label}</span><div><i style={{ width: `${(item.score / item.max) * 100}%` }} /></div><strong>{item.score}/{item.max}</strong></div>)}</div>
                <details className="evidence-box" open><summary>Evidence behind this score <span>{product.evidence.length} sources</span></summary>{product.evidence.map((item) => <div className="evidence-row" key={item.claim}><span className="evidence-check"><Check /></span><div><strong>{item.claim}</strong><small>{item.source}</small></div><em>{item.level}</em></div>)}</details>
                {product.alternative ? (
                  <div className="swap-card"><div className="swap-score"><span>BEST SWAP</span><strong>{product.alternative.score}</strong><small>/100</small></div><div className="swap-info"><span>{product.alternative.certification}</span><h3>{product.alternative.name}</h3><p>{product.alternative.reasons.join(' · ')}</p><small>{product.alternative.confidence}</small></div><div className="swap-action"><strong>${product.alternative.price.toFixed(2)}</strong><span>Save ${(product.price - product.alternative.price).toFixed(2)}</span><Button>View this swap <ExternalLink /></Button>{product.alternative.affiliate && <small>GreenSwap may earn a commission. Scores stay independent.</small>}</div></div>
                ) : <div className="keep-card"><ShieldCheck /><div><strong>Keep your current choice.</strong><p>We didn’t find a meaningfully greener option at this price. GreenSwap never recommends a purchase just to earn a commission.</p></div></div>}
                <Button variant="outline" onClick={() => setStatus('idle')}>Run again</Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="method-preview" id="method">
        <span className="kicker">The GreenSwap standard</span><h2>A score people can inspect, not a number they have to trust.</h2>
        <div className="method-grid">
          <article><span>01</span><Search /><h3>Identify</h3><p>Match the exact product using retailer data, model numbers, and verified manufacturer records.</p></article>
          <article><span>02</span><FlaskConical /><h3>Investigate</h3><p>Check ingredients, materials, packaging, lifespan, and independent certifications.</p></article>
          <article><span>03</span><ShieldCheck /><h3>Score honestly</h3><p>Use category-specific rules and display what is verified, documented, extracted, or estimated.</p></article>
          <article><span>04</span><Leaf /><h3>Compare fairly</h3><p>Find meaningfully greener choices without letting commission alter environmental scores.</p></article>
        </div>
      </section>

      <PartnerSection />
      <footer><a className="brand" href="#top"><span className="brand-mark"><Leaf size={18} /></span>GreenSwap</a><p>Evidence-first product comparisons for everyday decisions.</p><span>Prototype · 2026</span></footer>
    </main>
  );
}
