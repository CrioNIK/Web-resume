import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { emitHudSound } from '../../lib/hudEvents';
import type { AssetProfile } from '../../data/assetsCatalog';

type AssetLabels = {
	openSpec: string;
	closeSpec: string;
	selectPrompt: string;
	category: string;
	status: string;
	preview: string;
	useCases: string;
	codeSample: string;
	exampleOutput: string;
	tags: string;
};

interface AssetsWorkbenchProps {
	assets: AssetProfile[];
	labels: AssetLabels;
}

function AssetPreview({ asset }: { asset: AssetProfile }) {
	if (asset.id === 'glitch-route-layer') {
		return (
			<div className="asset-preview asset-preview--glitch">
				<div className="asset-preview__band" />
				<div className="asset-preview__band asset-preview__band--short" />
				<div className="asset-preview__frame">ROUTE SHIFT</div>
			</div>
		);
	}

	if (asset.id === 'angled-hud-card') {
		return (
			<div className="asset-preview asset-preview--card">
				<div className="asset-preview__hud-card">
					<span>STAT NODE</span>
					<strong>98%</strong>
				</div>
			</div>
		);
	}

	return (
		<div className="asset-preview asset-preview--button">
			<button type="button" className="button button--primary" onMouseEnter={() => emitHudSound('hover')} onClick={() => emitHudSound('confirm')}>
				PULSE
			</button>
		</div>
	);
}

export default function AssetsWorkbench({ assets, labels }: AssetsWorkbenchProps) {
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [panelOpen, setPanelOpen] = useState(false);

	const selectedAsset = useMemo(
		() => assets.find((asset) => asset.id === selectedId) ?? assets[0] ?? null,
		[assets, selectedId]
	);

	const openSpec = (id: string) => {
		setSelectedId(id);
		setPanelOpen(true);
		emitHudSound('panel-open');
	};

	const closeSpec = () => {
		setPanelOpen(false);
		emitHudSound('panel-close');
	};

	return (
		<div className="workbench-shell">
			<div className="workbench-browser panel">
				{assets.map((asset) => {
					const active = selectedAsset?.id === asset.id && panelOpen;
					return (
						<article key={asset.id} className={`workbench-card ${active ? 'is-active' : ''}`}>
							<div className="workbench-card__meta">
								<p>{asset.category}</p>
								<span className="workbench-card__accent" style={{ backgroundColor: asset.accent }} />
							</div>
							<h3>{asset.title}</h3>
							<p className="workbench-card__summary">{asset.summary}</p>
							<p className="workbench-card__description">{asset.description}</p>
							<ul className="chip-list workbench-card__tags">
								{asset.tags.map((tag) => (
									<li key={tag}>{tag}</li>
								))}
							</ul>
							<div className="workbench-card__actions">
								<button type="button" className="button button--primary" onMouseEnter={() => emitHudSound('hover')} onClick={() => openSpec(asset.id)}>
									{labels.openSpec}
								</button>
							</div>
						</article>
					);
				})}
			</div>
			<div className={`workbench-dock ${panelOpen ? 'is-open' : ''}`}>
				<AnimatePresence mode="wait">
					{panelOpen && selectedAsset ? (
						<motion.aside
							key={selectedAsset.id}
							className="panel workbench-detail"
							initial={{ opacity: 0, x: 24 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 24 }}
						>
							<div className="workbench-detail__header">
								<div>
									<p>{selectedAsset.category}</p>
									<h3>{selectedAsset.title}</h3>
								</div>
								<button
									type="button"
									className="button button--ghost"
									onMouseEnter={() => emitHudSound('hover')}
									onClick={closeSpec}
								>
									{labels.closeSpec}
								</button>
							</div>
							<div className="workbench-detail__grid">
								<div className="workbench-detail__badge"><span>{labels.category}</span><strong>{selectedAsset.category}</strong></div>
								<div className="workbench-detail__badge"><span>{labels.status}</span><strong>{selectedAsset.status}</strong></div>
							</div>
							<section className="workbench-detail__section">
								<h4>{labels.preview}</h4>
								<p className="workbench-detail__description">{selectedAsset.description}</p>
								<p className="workbench-detail__microcopy">{selectedAsset.previewLabel}</p>
								<AssetPreview asset={selectedAsset} />
							</section>
							<section className="workbench-detail__section">
								<h4>{labels.exampleOutput}</h4>
								<ul>
									{selectedAsset.exampleOutput.map((item) => <li key={item}>{item}</li>)}
								</ul>
							</section>
							<section className="workbench-detail__section">
								<h4>{labels.useCases}</h4>
								<ul>
									{selectedAsset.useCases.map((item) => <li key={item}>{item}</li>)}
								</ul>
							</section>
							<section className="workbench-detail__section">
								<h4>{labels.tags}</h4>
								<ul className="chip-list">
									{selectedAsset.tags.map((tag) => <li key={tag}>{tag}</li>)}
								</ul>
							</section>
							<section className="workbench-detail__section">
								<div className="workbench-detail__section-head">
									<h4>{labels.codeSample}</h4>
									<span>{selectedAsset.codeLanguage.toUpperCase()}</span>
								</div>
								<pre className="workbench-code"><code>{selectedAsset.code}</code></pre>
							</section>
						</motion.aside>
					) : (
						<motion.aside key="empty" className="panel workbench-detail workbench-detail--empty" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
							<p>{labels.selectPrompt}</p>
						</motion.aside>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
