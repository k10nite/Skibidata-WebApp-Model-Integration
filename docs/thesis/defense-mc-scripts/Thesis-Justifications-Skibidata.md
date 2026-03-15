# Thesis Justifications: Satellite Remote Sensing for Soil Nutrient Analysis
## Skibidata Research - Supporting Literature & Recent Developments (2024-2025)

---

## 1. SENTINEL-2A: FREE, OPEN, AND HISTORICALLY RICH DATA

### Why Sentinel-2A is Ideal for Our Research

| Feature | Details |
|---------|---------|
| **Launch Date** | June 23, 2015 (Sentinel-2A) |
| **Historical Archive** | **10 years** of continuous global data (2015-present) |
| **Cost** | **Completely FREE** — open access for all users |
| **Coverage** | Global land surface (83°N to 56°S latitude) |
| **Revisit Time** | Every 5 days (with Sentinel-2A + 2B combined) |
| **Resolution** | 10-meter multispectral imagery |

### Data Availability Timeline
- **L1C data**: Available globally from **June 2015**
- **L2A data**: Available over Europe from November 2016, **globally since January 2017**

### Open Access Policy (ESA/Copernicus)
> "Sentinel data products are made available systematically and **free of charge** to all data users including the general public, scientific and commercial users."

> "Access to Sentinel data is **free, full and open** for the broad Regional, National, European and International user community."

### Access Points
- **Copernicus Data Space Ecosystem** — Primary access portal
- **USGS EROS Archive** — Mirror for US users
- **AWS Open Data Registry** — Cloud-based access
- **Sentinel Hub** — API access for developers

**Justification:** *Sentinel-2A's 10-year historical archive allows us to analyze temporal soil patterns in CAR across multiple cropping seasons. The free and open data policy eliminates cost barriers, making our research replicable and our system sustainable for local government and agricultural extension workers. Unlike proprietary satellite data (which can cost thousands per image), Sentinel-2 ensures our decision-support system remains accessible to Filipino farmers.*

**Justification (Reproducibility):** *The publicly available nature of Sentinel-2 data means our methodology can be independently verified and extended to other Philippine regions without additional data acquisition costs.*

---

## 2. SATELLITE TECHNOLOGY ADVANCEMENTS (2025)

### Explosive Growth in Earth Observation Satellites
- Annual EO satellite launches grew from **15 satellites in 2022** to **167 satellites in 2025** — a **tenfold increase** in just three years
- Between 2022 and mid-2025, **405 Earth observation satellites** entered orbit, representing one of the fastest infrastructure expansions in space economy history
- The Global Remote Sensing Satellite Market was valued at **USD 17.93 billion in 2024** and is projected to grow to **USD 45.33 billion by 2034**

**Justification:** *The rapid expansion of satellite infrastructure demonstrates global recognition of remote sensing's value in agriculture, environmental monitoring, and resource management. Our research aligns with this trajectory by leveraging freely accessible satellite data (Sentinel-2, Landsat) for local agricultural applications.*

### Key 2025 Satellite Launches Relevant to Agriculture
| Satellite | Launch Date | Capabilities |
|-----------|-------------|--------------|
| Jitianxing A-05 | January 2025 | Hyperspectral imaging for ecological surveillance, agricultural monitoring, forest management |
| PAUSAT-1 (Pakistan) | January 14, 2025 | High-resolution multispectral (1.5m) + hyperspectral imager |
| NASA-ISRO NISAR | July 30, 2025 | Dual-frequency SAR for agriculture and disaster management |
| SpaceEye-T (Korea) | 2025 | Very high resolution imaging |
| EU Copernicus Expansion | 2025 | Three new satellites for environmental monitoring |

**Justification:** *The 2025 launch of hyperspectral satellites (Jitianxing A-05) specifically for agricultural monitoring validates the global shift toward satellite-based precision agriculture. Our research contributes to this movement at the local level.*

### Harmonized Landsat-Sentinel (HLS) Dataset
NASA's HLS project creates a **virtual constellation** combining:
- Operational Land Imager (OLI) on Landsat 8/9
- MultiSpectral Instrument (MSI) on Sentinel-2
- Seamless integration through atmospheric correction and cloud masking

**Justification:** *The HLS dataset, which we can utilize, provides higher temporal resolution than either satellite alone — critical for monitoring dynamic soil conditions in the Cordillera's variable climate.*

---

## 2. DOST-ENDORSED TECHNOLOGIES & PROGRAMS

### SARAi Program (DOST-PCAARRD)
The **Smarter Approaches to Reinvigorate Agriculture as an Industry in the Philippines (SARAi)** program, led by UP Los Baños, directly endorses the technologies we are using:

| Technology | Description | Our Application |
|------------|-------------|-----------------|
| **Satellite Remote Sensing** | Crop and soil monitoring from space | Soil nutrient prediction using Sentinel-2 |
| **Geographic Information System (GIS)** | Spatial data analysis and mapping | Municipal-level soil mapping in CAR |
| **Machine Learning** | Predictive modeling for agriculture | XGBoost/Random Forest for NPK prediction |
| **NDVI Analysis** | Vegetation health assessment | Correlating vegetation indices with soil nutrients |

**Justification:** *Our methodology directly aligns with DOST-PCAARRD's SARAi program, which promotes science-based tools for Philippine agriculture. This government endorsement validates our technical approach.*

### CL-SEAMS (Community-Level SARAI Enhanced Agricultural Monitoring System)
DOST's CL-SEAMS provides:
- Near real-time, site-specific crop monitoring
- Damage assessment using GIS and remote sensing
- NDVI-based vegetation analysis

**Justification:** *Our research extends CL-SEAMS concepts by adding soil nutrient prediction capabilities — filling a gap in the current DOST ecosystem.*

### DOST Soil Health Enhancement Program (March 2025)
DOST-PCAARRD launched a **Soil Health Enhancement Program** emphasizing:
- **Site-specific fertilizer management** (exactly what our system provides)
- **Centralized soil information system** for evidence-based decisions
- Focus areas include rice-based cropping systems

Key Quote: *"The program aims to address persistent challenges including low productivity, soil degradation, and weak soil health management."*

**Justification:** *Our decision-support system for fertilizer recommendations directly addresses DOST's 2025 priority of site-specific nutrient management. The timing of our research aligns with national agricultural policy.*

### DOST-ASTI DATOS Training Program
DOST-Advanced Science and Technology Institute (ASTI) conducts training on:
- Synthetic Aperture Radar (SAR) image pre-processing
- Crop detection using Dynamic Time Warping (DTW)
- Seasonal crop mapping for Department of Agriculture

**Justification:** *DOST-ASTI's active training programs on satellite imagery analysis demonstrate institutional support for remote sensing in Philippine agriculture. Our research contributes locally-validated models that could be integrated into these programs.*

---

## 3. MACHINE LEARNING MODELS FOR SOIL PREDICTION (2024-2025 Research)

### Recommended Models Based on Latest Research

| Model | Application | Performance | Source |
|-------|-------------|-------------|--------|
| **XGBoost** | Soil nutrient prediction, SOCS mapping | High accuracy, computationally efficient | AgroLens Project (2025) |
| **Random Forest (RF)** | Total N content prediction | R² = 0.74, RMSE = 0.10 g/kg | Suihua City Study (2023) |
| **Support Vector Machine** | Soil salinity mapping | Strong performance in arid regions | ScienceDirect (2023) |

### Sentinel-2 vs Landsat 8 for Soil Analysis (2025 Findings)
A 2025 comparative study found:
- **Sentinel-2**: R² = 0.65, RMSE = 0.28 for SOC estimation
- **Landsat 8**: R² = 0.52, RMSE = 0.32 for SOC estimation
- **Combined approach** (Gram-Schmidt algorithm): Higher correlation than individual satellites

**Justification:** *Recent research (2025) confirms Sentinel-2's superiority for soil parameter estimation. Our choice of Sentinel-2 as primary data source is validated by peer-reviewed findings.*

### AgroLens Project Methodology (March 2025)
The AgroLens project demonstrates:
- ML-based soil nutrient prediction **without laboratory tests**
- Uses LUCAS Soil dataset + Sentinel-2 imagery
- XGBoost as primary model
- Designed for **resource-constrained areas**

**Justification:** *The AgroLens methodology mirrors our approach — proving that satellite-based soil nutrient prediction is not only feasible but actively being developed globally. Our research localizes this approach for Philippine conditions.*

### Landsat 9 for Soil Organic Carbon (2024)
Geng et al. (2024) successfully applied Landsat 9 to assess:
- Spatial variation of SOC in agricultural regions
- C:N ratio mapping using crop growth information

**Justification:** *Landsat 9's proven capabilities for soil carbon mapping extend to our NPK prediction objectives, as nitrogen content correlates with organic carbon dynamics.*

---

## 4. PHILIPPINE AGRICULTURE CONTEXT (2025)

### Smart Farming Adoption
DOST-CAR Regional Director Nancy Bantog (August 2025):
> "The agency is actively implementing SARAI, a four-year program promoting science-based tools and technologies."

**Key trends:**
- Satellite images processed with AI/ML for remote monitoring
- NDVI tracking for crop health assessment
- Identification of nutrient deficiencies from space

**Justification:** *DOST-CAR's active promotion of satellite-based smart farming in our region (Cordillera) creates immediate relevance and potential adoption pathways for our research.*

### Regional Soil Challenges
The Philippines faces:
- Low agricultural productivity
- Soil degradation from improper fertilizer use
- Weak soil health management systems
- Limited access to soil testing facilities (especially in remote CAR municipalities)

**Justification:** *Our satellite-based approach addresses the accessibility gap — farmers in La Trinidad, Tublay, Sablan, Tuba, and Itogon can receive soil nutrient recommendations without waiting for laboratory results.*

---

## 5. SUMMARY: KEY JUSTIFICATION POINTS

### Technical Validity
1. **Sentinel-2 outperforms Landsat 8** for soil parameter estimation (2025 peer-reviewed research)
2. **XGBoost and Random Forest** are proven effective for soil nutrient prediction
3. **Combined satellite approach** yields higher accuracy than single-source data

### Government Alignment
1. **DOST-PCAARRD SARAi program** endorses satellite remote sensing + ML for agriculture
2. **DOST Soil Health Enhancement Program (2025)** prioritizes site-specific fertilizer management
3. **DOST-CAR** actively promotes smart farming technologies in Cordillera region

### Market & Global Context
1. **USD 45.33 billion** projected remote sensing market by 2034
2. **405 EO satellites** launched 2022-2025 — unprecedented growth
3. **AgroLens Project (2025)** validates laboratory-free soil prediction using our exact methodology

### Local Impact
1. Addresses **soil testing accessibility** in remote CAR municipalities
2. Supports **precision fertilizer application** to reduce waste and cost
3. Contributes to **national food security** through improved agricultural productivity

---

## SOURCES

### Sentinel-2 Data Access
- [Copernicus Data Space - Sentinel-2 Collections](https://dataspace.copernicus.eu/data-collections/copernicus-sentinel-data/sentinel-2)
- [Sentinel-2 Documentation - Copernicus](https://documentation.dataspace.copernicus.eu/Data/SentinelMissions/Sentinel2.html)
- [USGS EROS Archive - Sentinel-2](https://www.usgs.gov/centers/eros/science/usgs-eros-archive-sentinel-2)
- [AWS Open Data Registry - Sentinel-2](https://registry.opendata.aws/sentinel-2/)
- [Sentinel Data Access Overview](https://sentinels.copernicus.eu/sentinel-data-access)

### Satellite Technology
- [Earth Observation Portal - October 2024 to January 2025 Launches](https://www.eoportal.org/other-space-activities/october-2024-january-2025)
- [Pixalytics - Early 2025 EO Launches](https://www.pixalytics.com/early-2025-eo-launches/)
- [NASA - What's Next for HLS](https://science.nasa.gov/missions/landsat/whats-next-for-hls/)
- [Remote Sensing Satellite Market Report 2034](https://www.marketresearchfuture.com/reports/remote-sensing-satellite-market-1659)

### DOST Philippines
- [DOST-PCAARRD SARAi at iSCENE 2025](https://www.pcaarrd.dost.gov.ph/index.php/quick-information-dispatch-qid-articles/smart-agricultural-resource-management-technologies-featured-during-iscene-2025)
- [DOST Smart Agriculture Initiative (PNA)](https://www.pna.gov.ph/articles/1256088)
- [DOST-PCAARRD Soil Health Enhancement Program](https://www.pcaarrd.dost.gov.ph/index.php/quick-information-dispatch-qid-articles/soil-health-enhancement-program-to-boost-productivity-of-key-cropping-systems-in-the-philippines)
- [DOST-ASTI DATOS Crop Mapping Training](https://asti.dost.gov.ph/communications/news-articles/datos-holds-3-day-seasonal-crop-mapping-training-for-department-of-agriculture/)

### Machine Learning & Soil Prediction
- [AgroLens: ML Models for Soil Parameter Prediction (2025)](https://arxiv.org/html/2503.22276v1)
- [Sentinel-2 vs Landsat 8 for SOC Prediction (2025)](https://link.springer.com/article/10.1007/s12665-025-12235-y)
- [Combined Landsat 8 & Sentinel-2 for Soil Fertility (2024)](https://pubmed.ncbi.nlm.nih.gov/38198078/)
- [SOCS Prediction with Sentinel-1 & Sentinel-2 (2024)](https://ecologicalprocesses.springeropen.com/articles/10.1186/s13717-024-00515-7)
- [Cropland Soil Nutrients Mapping with Remote Sensing & ML](https://www.mdpi.com/2077-0472/13/8/1592)

### Philippine Agriculture
- [Smart Farming in the Philippines 2025](https://farmonaut.com/asia/smart-farming-in-the-philippines-2025-innovations)
- [Agriculture in the Philippines 2025 Trends](https://farmonaut.com/asia/agriculture-in-the-philippines-2025-must-know-trends)
