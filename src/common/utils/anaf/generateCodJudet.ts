const codJudet = async (county: string) => {
    const counties = ['alba', 'arad', 'arges', 'bacau', 'bihor', 'bistrita-nasaud', 'botosani', 'brasov', 'braila', 'buzau', 'caras-severin', 'cluj', 'constanta', 'covasna', 'dambovita', 'dolj', 'galati', 'gorj', 'harghita', 'hunedoara', 'ialomita', 'iasi', 'ilfov', 'maramures', 'mehedinti', 'mures', 'neamt', 'olt', 'prahova', 'satu mare', 'salaj', 'sibiu', 'suceava', 'teleorman', 'timis', 'tulcea', 'vaslui', 'valcea', 'vrancea', 'bucuresti'];
    county = county.toLowerCase();
    county = county.replace(/ă/g, 'a').trim();
    county = county.replace(/â/g, 'a').trim();
    county = county.replace(/ș/g, 's').trim();
    county = county.replace(/ț/g, 't').trim();
    county = county.replace(/î/g, 'i').trim();

    const indexOfCounty = counties.indexOf(county);

    if (indexOfCounty !== -1) {
        return indexOfCounty + 1;
    } else if (county === 'giurgiu') {
        return 52;
    } else {
        return 51;
    }
};

export default codJudet;
