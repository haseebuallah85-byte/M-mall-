import { CompoundDetail } from '../types';

export const FEATURED_COMPOUNDS: CompoundDetail[] = [
  {
    cid: 5793,
    name: 'D-Glucose',
    iupacName: '(2R,3S,4R,5R)-2,3,4,5,6-pentahydroxyhexanal',
    molecularFormula: 'C6H12O6',
    molecularWeight: '180.16 g/mol',
    canonicalSmiles: 'C(C1C(C(C(C(O1)O)O)O)O)O',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/5793/PNG',
    description: 'Essential biological carbohydrate and carbon substrate utilized universally in cellular respiration, microbiological growth media, and clinical IV rehydration formulations.',
    safetySummary: 'Non-hazardous. Safe handling under standard good laboratory practices (GLP).',
    suggestedPricePkr: 1650
  },
  {
    cid: 702,
    name: 'Ethanol (Absolute Alcohol 99.9%)',
    iupacName: 'ethanol',
    molecularFormula: 'C2H6O',
    molecularWeight: '46.07 g/mol',
    canonicalSmiles: 'CCO',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/702/PNG',
    description: 'High-purity analytical solvent used for nucleic acid (DNA/RNA) precipitation, biological tissue preservation, disinfection, and chemical chromatography extraction.',
    safetySummary: 'Flammable liquid (GHS02). Keep away from open flame and heat sources.',
    suggestedPricePkr: 2200
  },
  {
    cid: 2519,
    name: 'Caffeine Pure Anhydrous',
    iupacName: '1,3,7-trimethylpurine-2,6-dione',
    molecularFormula: 'C8H10N4O2',
    molecularWeight: '194.19 g/mol',
    canonicalSmiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/2519/PNG',
    description: 'Methylxanthine alkaloid standard for analytical spectrophotometry, HPLC calibration, pharmacology education, and central nervous system biochemical receptor assays.',
    safetySummary: 'Harmful if swallowed (GHS07). Store in tightly sealed moisture-proof container.',
    suggestedPricePkr: 2850
  },
  {
    cid: 6077,
    name: 'Tris Base (Tris(hydroxymethyl)aminomethane)',
    iupacName: '2-amino-2-(hydroxymethyl)propane-1,3-diol',
    molecularFormula: 'C4H11NO3',
    molecularWeight: '121.14 g/mol',
    canonicalSmiles: 'C(C(CO)(CO)N)O',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/6077/PNG',
    description: 'Gold-standard biological buffer for molecular biology (TAE / TBE electrophoresis buffers, SDS-PAGE running buffers, and DNA extraction lysis protocols).',
    safetySummary: 'Causes skin and serious eye irritation (GHS07). Wear safety goggles and nitrile gloves.',
    suggestedPricePkr: 3400
  },
  {
    cid: 54670067,
    name: 'Ascorbic Acid (Vitamin C Pure Grade)',
    iupacName: '(5R)-[(1S)-1,2-dihydroxyethyl]-3,4-dihydroxyfuran-2(5H)-one',
    molecularFormula: 'C6H8O6',
    molecularWeight: '176.12 g/mol',
    canonicalSmiles: 'C(C(C1C(=C(C(=O)O1)O)O)O)O',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/54670067/PNG',
    description: 'Vital biological antioxidant and enzymatic cofactor used in cell culture protection against oxidative stress and analytical redox titrations.',
    safetySummary: 'Non-hazardous reagent. Store protected from ambient light and heat.',
    suggestedPricePkr: 1950
  },
  {
    cid: 6049,
    name: 'EDTA Disodium Dihydrate',
    iupacName: 'disodium;2-[2-[bis(carboxylatomethyl)amino]ethyl-(carboxylatomethyl)amino]acetate;dihydrate',
    molecularFormula: 'C10H18N2Na2O10',
    molecularWeight: '372.24 g/mol',
    canonicalSmiles: 'C(CN(CC(=O)[O-])CC(=O)[O-])N(CC(=O)O)CC(=O)O.O.O.[Na+].[Na+]',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/6049/PNG',
    description: 'Versatile divalent metal ion chelating agent indispensable for inhibiting DNase enzymes during plasmid isolation, molecular genetics, and metal titration analysis.',
    safetySummary: 'May cause respiratory irritation. Handle with care under laminar air flow or fume hood.',
    suggestedPricePkr: 2600
  }
];

export async function searchPubChemCompound(query: string): Promise<CompoundDetail | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  // First check if query matches our curated high-reliability list
  const localMatch = FEATURED_COMPOUNDS.find(c => 
    c.name.toLowerCase().includes(trimmed.toLowerCase()) || 
    c.molecularFormula.toLowerCase() === trimmed.toLowerCase() ||
    c.cid.toString() === trimmed
  );
  if (localMatch) return localMatch;

  try {
    const encoded = encodeURIComponent(trimmed);
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encoded}/property/MolecularFormula,MolecularWeight,IUPACName,CanonicalSMILES/JSON`;
    
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) return null;

    const data = await response.json();
    const props = data?.PropertyTable?.Properties?.[0];
    if (!props) return null;

    const cid = props.CID;
    return {
      cid,
      name: trimmed.charAt(0).toUpperCase() + trimmed.slice(1),
      iupacName: props.IUPACName || 'IUPAC Name Available in PubChem',
      molecularFormula: props.MolecularFormula || '',
      molecularWeight: props.MolecularWeight ? `${props.MolecularWeight} g/mol` : 'N/A',
      canonicalSmiles: props.CanonicalSMILES || '',
      imageUrl: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG`,
      description: `Authoritative chemical structure verified via NCBI PubChem (CID: ${cid}). High-grade bioscience & laboratory reagent compound.`,
      safetySummary: 'Authentic PubChem Record. Review safety data sheet (SDS) before handling.',
      suggestedPricePkr: Math.round(1500 + (cid % 2500))
    };
  } catch (err) {
    console.warn('PubChem fetch skipped or failed, using local fallback:', err);
    return null;
  }
}
