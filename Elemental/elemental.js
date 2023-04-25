let elementData = [
    {"atomicNumber":1,"symbol":"H","name":"Hydrogen","atomicMass":1.00794,"cpkHexColor":"FFFFFF","electronicConfiguration":"1s1","electronegativity":2.2,"atomicRadius":37,"ionRadius":"","vanDelWaalsRadius":120,"ionizationEnergy":1312,"electronAffinity":-73,"oxidationStates":"-1, 1","standardState":"gas","bondingType":"diatomic","meltingPoint":14,"boilingPoint":20,"density":0.0000899,"groupBlock":"nonmetal","yearDiscovered":1766},
    {"atomicNumber":2,"symbol":"He","name":"Helium","atomicMass":4.002602,"cpkHexColor":"D9FFFF","electronicConfiguration":"1s2","electronegativity":"","atomicRadius":32,"ionRadius":"","vanDelWaalsRadius":140,"ionizationEnergy":2372,"electronAffinity":0,"oxidationStates":"","standardState":"gas","bondingType":"atomic","meltingPoint":"","boilingPoint":4,"density":0.0001785,"groupBlock":"noble gas","yearDiscovered":1868},
    {"atomicNumber":3,"symbol":"Li","name":"Lithium","atomicMass":6.941,"cpkHexColor":"CC80FF","electronicConfiguration":"[He] 2s1","electronegativity":0.98,"atomicRadius":134,"ionRadius":"76 (+1)","vanDelWaalsRadius":182,"ionizationEnergy":520,"electronAffinity":-60,"oxidationStates":1,"standardState":"solid","bondingType":"metallic","meltingPoint":454,"boilingPoint":1615,"density":0.535,"groupBlock":"alkali metal","yearDiscovered":1817},
    {"atomicNumber":4,"symbol":"Be","name":"Beryllium","atomicMass":9.012182,"cpkHexColor":"C2FF00","electronicConfiguration":"[He] 2s2","electronegativity":1.57,"atomicRadius":90,"ionRadius":"45 (+2)","vanDelWaalsRadius":"","ionizationEnergy":900,"electronAffinity":0,"oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":1560,"boilingPoint":2743,"density":1.848,"groupBlock":"alkaline earth metal","yearDiscovered":1798},
    {"atomicNumber":5,"symbol":"B","name":"Boron","atomicMass":10.811,"cpkHexColor":"FFB5B5","electronicConfiguration":"[He] 2s2 2p1","electronegativity":2.04,"atomicRadius":82,"ionRadius":"27 (+3)","vanDelWaalsRadius":"","ionizationEnergy":801,"electronAffinity":-27,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"covalent network","meltingPoint":2348,"boilingPoint":4273,"density":2.46,"groupBlock":"metalloid","yearDiscovered":1807},
    {"atomicNumber":6,"symbol":"C","name":"Carbon","atomicMass":12.0107,"cpkHexColor":909090,"electronicConfiguration":"[He] 2s2 2p2","electronegativity":2.55,"atomicRadius":77,"ionRadius":"16 (+4)","vanDelWaalsRadius":170,"ionizationEnergy":1087,"electronAffinity":-154,"oxidationStates":"-4, -3, -2, -1, 1, 2, 3, 4","standardState":"solid","bondingType":"covalent network","meltingPoint":3823,"boilingPoint":4300,"density":2.26,"groupBlock":"nonmetal","yearDiscovered":"Ancient"},
    {"atomicNumber":7,"symbol":"N","name":"Nitrogen","atomicMass":14.0067,"cpkHexColor":"3050F8","electronicConfiguration":"[He] 2s2 2p3","electronegativity":3.04,"atomicRadius":75,"ionRadius":"146 (-3)","vanDelWaalsRadius":155,"ionizationEnergy":1402,"electronAffinity":-7,"oxidationStates":"-3, -2, -1, 1, 2, 3, 4, 5","standardState":"gas","bondingType":"diatomic","meltingPoint":63,"boilingPoint":77,"density":0.001251,"groupBlock":"nonmetal","yearDiscovered":1772},
    {"atomicNumber":8,"symbol":"O","name":"Oxygen","atomicMass":15.9994,"cpkHexColor":"FF0D0D","electronicConfiguration":"[He] 2s2 2p4","electronegativity":3.44,"atomicRadius":73,"ionRadius":"140 (-2)","vanDelWaalsRadius":152,"ionizationEnergy":1314,"electronAffinity":-141,"oxidationStates":"-2, -1, 1, 2","standardState":"gas","bondingType":"diatomic","meltingPoint":55,"boilingPoint":90,"density":0.001429,"groupBlock":"nonmetal","yearDiscovered":1774},
    {"atomicNumber":9,"symbol":"F","name":"Fluorine","atomicMass":18.9984032,"cpkHexColor":"90E050","electronicConfiguration":"[He] 2s2 2p5","electronegativity":3.98,"atomicRadius":71,"ionRadius":"133 (-1)","vanDelWaalsRadius":147,"ionizationEnergy":1681,"electronAffinity":-328,"oxidationStates":-1,"standardState":"gas","bondingType":"atomic","meltingPoint":54,"boilingPoint":85,"density":0.001696,"groupBlock":"halogen","yearDiscovered":1670},
    {"atomicNumber":10,"symbol":"Ne","name":"Neon","atomicMass":20.1797,"cpkHexColor":"B3E3F5","electronicConfiguration":"[He] 2s2 2p6","electronegativity":"","atomicRadius":69,"ionRadius":"","vanDelWaalsRadius":154,"ionizationEnergy":2081,"electronAffinity":0,"oxidationStates":"","standardState":"gas","bondingType":"atomic","meltingPoint":25,"boilingPoint":27,"density":0.0009,"groupBlock":"noble gas","yearDiscovered":1898},
    {"atomicNumber":11,"symbol":"Na","name":"Sodium","atomicMass":22.98976928,"cpkHexColor":"AB5CF2","electronicConfiguration":"[Ne] 3s1","electronegativity":0.93,"atomicRadius":154,"ionRadius":"102 (+1)","vanDelWaalsRadius":227,"ionizationEnergy":496,"electronAffinity":-53,"oxidationStates":"-1, 1","standardState":"solid","bondingType":"metallic","meltingPoint":371,"boilingPoint":1156,"density":0.968,"groupBlock":"alkali metal","yearDiscovered":1807},
    {"atomicNumber":12,"symbol":"Mg","name":"Magnesium","atomicMass":24.3050,"cpkHexColor":"8AFF00","electronicConfiguration":"[Ne] 3s2","electronegativity":1.31,"atomicRadius":130,"ionRadius":"72 (+2)","vanDelWaalsRadius":173,"ionizationEnergy":738,"electronAffinity":0,"oxidationStates":"1, 2","standardState":"solid","bondingType":"metallic","meltingPoint":923,"boilingPoint":1363,"density":1.738,"groupBlock":"alkaline earth metal","yearDiscovered":1808},
    {"atomicNumber":13,"symbol":"Al","name":"Aluminum","atomicMass":26.9815386,"cpkHexColor":"BFA6A6","electronicConfiguration":"[Ne] 3s2 3p1","electronegativity":1.61,"atomicRadius":118,"ionRadius":"53.5 (+3)","vanDelWaalsRadius":"","ionizationEnergy":578,"electronAffinity":-43,"oxidationStates":"1, 3","standardState":"solid","bondingType":"metallic","meltingPoint":933,"boilingPoint":2792,"density":2.7,"groupBlock":"metal","yearDiscovered":"Ancient"},
    {"atomicNumber":14,"symbol":"Si","name":"Silicon","atomicMass":28.0855,"cpkHexColor":"F0C8A0","electronicConfiguration":"[Ne] 3s2 3p2","electronegativity":1.9,"atomicRadius":111,"ionRadius":"40 (+4)","vanDelWaalsRadius":210,"ionizationEnergy":787,"electronAffinity":-134,"oxidationStates":"-4, -3, -2, -1, 1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1687,"boilingPoint":3173,"density":2.33,"groupBlock":"metalloid","yearDiscovered":1854},
    {"atomicNumber":15,"symbol":"P","name":"Phosphorus","atomicMass":30.973762,"cpkHexColor":"FF8000","electronicConfiguration":"[Ne] 3s2 3p3","electronegativity":2.19,"atomicRadius":106,"ionRadius":"44 (+3)","vanDelWaalsRadius":180,"ionizationEnergy":1012,"electronAffinity":-72,"oxidationStates":"-3, -2, -1, 1, 2, 3, 4, 5","standardState":"solid","bondingType":"covalent network","meltingPoint":317,"boilingPoint":554,"density":1.823,"groupBlock":"nonmetal","yearDiscovered":1669},
    {"atomicNumber":16,"symbol":"S","name":"Sulfur","atomicMass":32.065,"cpkHexColor":"FFFF30","electronicConfiguration":"[Ne] 3s2 3p4","electronegativity":2.58,"atomicRadius":102,"ionRadius":"184 (-2)","vanDelWaalsRadius":180,"ionizationEnergy":1000,"electronAffinity":-200,"oxidationStates":"-2, -1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"covalent network","meltingPoint":388,"boilingPoint":718,"density":1.96,"groupBlock":"nonmetal","yearDiscovered":"Ancient"},
    {"atomicNumber":17,"symbol":"Cl","name":"Chlorine","atomicMass":35.453,"cpkHexColor":"1FF01F","electronicConfiguration":"[Ne] 3s2 3p5","electronegativity":3.16,"atomicRadius":99,"ionRadius":"181 (-1)","vanDelWaalsRadius":175,"ionizationEnergy":1251,"electronAffinity":-349,"oxidationStates":"-1, 1, 2, 3, 4, 5, 6, 7","standardState":"gas","bondingType":"covalent network","meltingPoint":172,"boilingPoint":239,"density":0.003214,"groupBlock":"halogen","yearDiscovered":1774},
    {"atomicNumber":18,"symbol":"Ar","name":"Argon","atomicMass":39.948,"cpkHexColor":"80D1E3","electronicConfiguration":"[Ne] 3s2 3p6","electronegativity":"","atomicRadius":97,"ionRadius":"","vanDelWaalsRadius":188,"ionizationEnergy":1521,"electronAffinity":0,"oxidationStates":"","standardState":"gas","bondingType":"atomic","meltingPoint":84,"boilingPoint":87,"density":0.001784,"groupBlock":"noble gas","yearDiscovered":1894},
    {"atomicNumber":19,"symbol":"K","name":"Potassium","atomicMass":39.0983,"cpkHexColor":"8F40D4","electronicConfiguration":"[Ar] 4s1","electronegativity":0.82,"atomicRadius":196,"ionRadius":"138 (+1)","vanDelWaalsRadius":275,"ionizationEnergy":419,"electronAffinity":-48,"oxidationStates":1,"standardState":"solid","bondingType":"metallic","meltingPoint":337,"boilingPoint":1032,"density":0.856,"groupBlock":"alkali metal","yearDiscovered":1807},
    {"atomicNumber":20,"symbol":"Ca","name":"Calcium","atomicMass":40.078,"cpkHexColor":"3DFF00","electronicConfiguration":"[Ar] 4s2","electronegativity":1,"atomicRadius":174,"ionRadius":"100 (+2)","vanDelWaalsRadius":"","ionizationEnergy":590,"electronAffinity":-2,"oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":1115,"boilingPoint":1757,"density":1.55,"groupBlock":"alkaline earth metal","yearDiscovered":"Ancient"},
    {"atomicNumber":21,"symbol":"Sc","name":"Scandium","atomicMass":44.955912,"cpkHexColor":"E6E6E6","electronicConfiguration":"[Ar] 3d1 4s2","electronegativity":1.36,"atomicRadius":144,"ionRadius":"74.5 (+3)","vanDelWaalsRadius":"","ionizationEnergy":633,"electronAffinity":-18,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1814,"boilingPoint":3103,"density":2.985,"groupBlock":"transition metal","yearDiscovered":1876},
    {"atomicNumber":22,"symbol":"Ti","name":"Titanium","atomicMass":47.867,"cpkHexColor":"BFC2C7","electronicConfiguration":"[Ar] 3d2 4s2","electronegativity":1.54,"atomicRadius":136,"ionRadius":"86 (+2)","vanDelWaalsRadius":"","ionizationEnergy":659,"electronAffinity":-8,"oxidationStates":"-1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1941,"boilingPoint":3560,"density":4.507,"groupBlock":"transition metal","yearDiscovered":1791},
    {"atomicNumber":23,"symbol":"V","name":"Vanadium","atomicMass":50.9415,"cpkHexColor":"A6A6AB","electronicConfiguration":"[Ar] 3d3 4s2","electronegativity":1.63,"atomicRadius":125,"ionRadius":"79 (+2)","vanDelWaalsRadius":"","ionizationEnergy":651,"electronAffinity":-51,"oxidationStates":"-1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":2183,"boilingPoint":3680,"density":6.11,"groupBlock":"transition metal","yearDiscovered":1803},
    {"atomicNumber":24,"symbol":"Cr","name":"Chromium","atomicMass":51.9961,"cpkHexColor":"8A99C7","electronicConfiguration":"[Ar] 3d5 4s1","electronegativity":1.66,"atomicRadius":127,"ionRadius":"80 (+2*)","vanDelWaalsRadius":"","ionizationEnergy":653,"electronAffinity":-64,"oxidationStates":"-2, -1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":2180,"boilingPoint":2944,"density":7.14,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
    {"atomicNumber":25,"symbol":"Mn","name":"Manganese","atomicMass":54.938045,"cpkHexColor":"9C7AC7","electronicConfiguration":"[Ar] 3d5 4s2","electronegativity":1.55,"atomicRadius":139,"ionRadius":"67 (+2)","vanDelWaalsRadius":"","ionizationEnergy":717,"electronAffinity":0,"oxidationStates":"-3, -2, -1, 1, 2, 3, 4, 5, 6, 7","standardState":"solid","bondingType":"metallic","meltingPoint":1519,"boilingPoint":2334,"density":7.47,"groupBlock":"transition metal","yearDiscovered":1774},
    {"atomicNumber":26,"symbol":"Fe","name":"Iron","atomicMass":55.845,"cpkHexColor":"E06633","electronicConfiguration":"[Ar] 3d6 4s2","electronegativity":1.83,"atomicRadius":125,"ionRadius":"78 (+2*)","vanDelWaalsRadius":"","ionizationEnergy":763,"electronAffinity":-16,"oxidationStates":"-2, -1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":1811,"boilingPoint":3134,"density":7.874,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
    {"atomicNumber":27,"symbol":"Co","name":"Cobalt","atomicMass":58.933195,"cpkHexColor":"F090A0","electronicConfiguration":"[Ar] 3d7 4s2","electronegativity":1.88,"atomicRadius":126,"ionRadius":"74.5 (+2*)","vanDelWaalsRadius":"","ionizationEnergy":760,"electronAffinity":-64,"oxidationStates":"-1, 1, 2, 3, 4, 5","standardState":"solid","bondingType":"metallic","meltingPoint":1768,"boilingPoint":3200,"density":8.9,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
    {"atomicNumber":28,"symbol":"Ni","name":"Nickel","atomicMass":58.6934,"cpkHexColor":"50D050","electronicConfiguration":"[Ar] 3d8 4s2","electronegativity":1.91,"atomicRadius":121,"ionRadius":"69 (+2)","vanDelWaalsRadius":163,"ionizationEnergy":737,"electronAffinity":-112,"oxidationStates":"-1, 1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1728,"boilingPoint":3186,"density":8.908,"groupBlock":"transition metal","yearDiscovered":1751},
    {"atomicNumber":29,"symbol":"Cu","name":"Copper","atomicMass":63.546,"cpkHexColor":"C88033","electronicConfiguration":"[Ar] 3d10 4s1","electronegativity":1.9,"atomicRadius":138,"ionRadius":"77 (+1)","vanDelWaalsRadius":140,"ionizationEnergy":746,"electronAffinity":-118,"oxidationStates":"1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1358,"boilingPoint":3200,"density":8.92,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
    {"atomicNumber":30,"symbol":"Zn","name":"Zinc","atomicMass":65.38,"cpkHexColor":"7D80B0","electronicConfiguration":"[Ar] 3d10 4s2","electronegativity":1.65,"atomicRadius":131,"ionRadius":"74 (+2)","vanDelWaalsRadius":139,"ionizationEnergy":906,"electronAffinity":0,"oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":693,"boilingPoint":1180,"density":7.14,"groupBlock":"transition metal","yearDiscovered":1746},
    {"atomicNumber":31,"symbol":"Ga","name":"Gallium","atomicMass":69.723,"cpkHexColor":"C28F8F","electronicConfiguration":"[Ar] 3d10 4s2 4p1","electronegativity":1.81,"atomicRadius":126,"ionRadius":"62 (+3)","vanDelWaalsRadius":187,"ionizationEnergy":579,"electronAffinity":-29,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":303,"boilingPoint":2477,"density":5.904,"groupBlock":"metal","yearDiscovered":1875},
    {"atomicNumber":32,"symbol":"Ge","name":"Germanium","atomicMass":72.64,"cpkHexColor":"668F8F","electronicConfiguration":"[Ar] 3d10 4s2 4p2","electronegativity":2.01,"atomicRadius":122,"ionRadius":"73 (+2)","vanDelWaalsRadius":"","ionizationEnergy":762,"electronAffinity":-119,"oxidationStates":"-4, 1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1211,"boilingPoint":3093,"density":5.323,"groupBlock":"metalloid","yearDiscovered":1886},
    {"atomicNumber":33,"symbol":"As","name":"Arsenic","atomicMass":74.92160,"cpkHexColor":"BD80E3","electronicConfiguration":"[Ar] 3d10 4s2 4p3","electronegativity":2.18,"atomicRadius":119,"ionRadius":"58 (+3)","vanDelWaalsRadius":185,"ionizationEnergy":947,"electronAffinity":-78,"oxidationStates":"-3, 2, 3, 5","standardState":"solid","bondingType":"metallic","meltingPoint":1090,"boilingPoint":887,"density":5.727,"groupBlock":"metalloid","yearDiscovered":"Ancient"},
    {"atomicNumber":34,"symbol":"Se","name":"Selenium","atomicMass":78.96,"cpkHexColor":"FFA100","electronicConfiguration":"[Ar] 3d10 4s2 4p4","electronegativity":2.55,"atomicRadius":116,"ionRadius":"198 (-2)","vanDelWaalsRadius":190,"ionizationEnergy":941,"electronAffinity":-195,"oxidationStates":"-2, 2, 4, 6","standardState":"solid","bondingType":"metallic","meltingPoint":494,"boilingPoint":958,"density":4.819,"groupBlock":"nonmetal","yearDiscovered":1817},
    {"atomicNumber":35,"symbol":"Br","name":"Bromine","atomicMass":79.904,"cpkHexColor":"A62929","electronicConfiguration":"[Ar] 3d10 4s2 4p5","electronegativity":2.96,"atomicRadius":114,"ionRadius":"196 (-1)","vanDelWaalsRadius":185,"ionizationEnergy":1140,"electronAffinity":-325,"oxidationStates":"-1, 1, 3, 4, 5, 7","standardState":"liquid","bondingType":"covalent network","meltingPoint":266,"boilingPoint":332,"density":3.12,"groupBlock":"halogen","yearDiscovered":1826},
    {"atomicNumber":36,"symbol":"Kr","name":"Krypton","atomicMass":83.798,"cpkHexColor":"5CB8D1","electronicConfiguration":"[Ar] 3d10 4s2 4p6","electronegativity":"","atomicRadius":110,"ionRadius":"","vanDelWaalsRadius":202,"ionizationEnergy":1351,"electronAffinity":0,"oxidationStates":2,"standardState":"gas","bondingType":"atomic","meltingPoint":116,"boilingPoint":120,"density":0.00375,"groupBlock":"noble gas","yearDiscovered":1898},
    {"atomicNumber":37,"symbol":"Rb","name":"Rubidium","atomicMass":85.4678,"cpkHexColor":"702EB0","electronicConfiguration":"[Kr] 5s1","electronegativity":0.82,"atomicRadius":211,"ionRadius":"152 (+1)","vanDelWaalsRadius":"","ionizationEnergy":403,"electronAffinity":-47,"oxidationStates":1,"standardState":"solid","bondingType":"metallic","meltingPoint":312,"boilingPoint":961,"density":1.532,"groupBlock":"alkali metal","yearDiscovered":1861},
    {"atomicNumber":38,"symbol":"Sr","name":"Strontium","atomicMass":87.62,"cpkHexColor":"00FF00","electronicConfiguration":"[Kr] 5s2","electronegativity":0.95,"atomicRadius":192,"ionRadius":"118 (+2)","vanDelWaalsRadius":"","ionizationEnergy":550,"electronAffinity":-5,"oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":1050,"boilingPoint":1655,"density":2.63,"groupBlock":"alkaline earth metal","yearDiscovered":1790},
    {"atomicNumber":39,"symbol":"Y","name":"Yttrium","atomicMass":88.90585,"cpkHexColor":"94FFFF","electronicConfiguration":"[Kr] 4d1 5s2","electronegativity":1.22,"atomicRadius":162,"ionRadius":"90 (+3)","vanDelWaalsRadius":"","ionizationEnergy":600,"electronAffinity":-30,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1799,"boilingPoint":3618,"density":4.472,"groupBlock":"transition metal","yearDiscovered":1794},
    {"atomicNumber":40,"symbol":"Zr","name":"Zirconium","atomicMass":91.224,"cpkHexColor":"94E0E0","electronicConfiguration":"[Kr] 4d2 5s2","electronegativity":1.33,"atomicRadius":148,"ionRadius":"72 (+4)","vanDelWaalsRadius":"","ionizationEnergy":640,"electronAffinity":-41,"oxidationStates":"1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":2128,"boilingPoint":4682,"density":6.511,"groupBlock":"transition metal","yearDiscovered":1789},
    {"atomicNumber":41,"symbol":"Nb","name":"Niobium","atomicMass":92.90638,"cpkHexColor":"73C2C9","electronicConfiguration":"[Kr] 4d4 5s1","electronegativity":1.6,"atomicRadius":137,"ionRadius":"72 (+3)","vanDelWaalsRadius":"","ionizationEnergy":652,"electronAffinity":-86,"oxidationStates":"-1, 2, 3, 4, 5","standardState":"solid","bondingType":"metallic","meltingPoint":2750,"boilingPoint":5017,"density":8.57,"groupBlock":"transition metal","yearDiscovered":1801},
    {"atomicNumber":42,"symbol":"Mo","name":"Molybdenum","atomicMass":95.96,"cpkHexColor":"54B5B5","electronicConfiguration":"[Kr] 4d5 5s1","electronegativity":2.16,"atomicRadius":145,"ionRadius":"69 (+3)","vanDelWaalsRadius":"","ionizationEnergy":684,"electronAffinity":-72,"oxidationStates":"-2, -1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":2896,"boilingPoint":4912,"density":10.28,"groupBlock":"transition metal","yearDiscovered":1778},
    {"atomicNumber":43,"symbol":"Tc","name":"Technetium","atomicMass":98,"cpkHexColor":"3B9E9E","electronicConfiguration":"[Kr] 4d5 5s2","electronegativity":1.9,"atomicRadius":156,"ionRadius":"64.5 (+4)","vanDelWaalsRadius":"","ionizationEnergy":702,"electronAffinity":-53,"oxidationStates":"-3, -1, 1, 2, 3, 4, 5, 6, 7","standardState":"solid","bondingType":"metallic","meltingPoint":2430,"boilingPoint":4538,"density":11.5,"groupBlock":"transition metal","yearDiscovered":1937},
    {"atomicNumber":44,"symbol":"Ru","name":"Ruthenium","atomicMass":101.07,"cpkHexColor":"248F8F","electronicConfiguration":"[Kr] 4d7 5s1","electronegativity":2.2,"atomicRadius":126,"ionRadius":"68 (+3)","vanDelWaalsRadius":"","ionizationEnergy":710,"electronAffinity":-101,"oxidationStates":"-2, 1, 2, 3, 4, 5, 6, 7, 8","standardState":"solid","bondingType":"metallic","meltingPoint":2607,"boilingPoint":4423,"density":12.37,"groupBlock":"transition metal","yearDiscovered":1827},
    {"atomicNumber":45,"symbol":"Rh","name":"Rhodium","atomicMass":102.90550,"cpkHexColor":"0A7D8C","electronicConfiguration":"[Kr] 4d8 5s1","electronegativity":2.28,"atomicRadius":135,"ionRadius":"66.5 (+3)","vanDelWaalsRadius":"","ionizationEnergy":720,"electronAffinity":-110,"oxidationStates":"-1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":2237,"boilingPoint":3968,"density":12.45,"groupBlock":"transition metal","yearDiscovered":1803},
    {"atomicNumber":46,"symbol":"Pd","name":"Palladium","atomicMass":106.42,"cpkHexColor":6985,"electronicConfiguration":"[Kr] 4d10","electronegativity":2.2,"atomicRadius":131,"ionRadius":"59 (+1)","vanDelWaalsRadius":163,"ionizationEnergy":804,"electronAffinity":-54,"oxidationStates":"2, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1828,"boilingPoint":3236,"density":12.023,"groupBlock":"transition metal","yearDiscovered":1803},
    {"atomicNumber":47,"symbol":"Ag","name":"Silver","atomicMass":107.8682,"cpkHexColor":"C0C0C0","electronicConfiguration":"[Kr] 4d10 5s1","electronegativity":1.93,"atomicRadius":153,"ionRadius":"115 (+1)","vanDelWaalsRadius":172,"ionizationEnergy":731,"electronAffinity":-126,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1235,"boilingPoint":2435,"density":10.49,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
    {"atomicNumber":48,"symbol":"Cd","name":"Cadmium","atomicMass":112.411,"cpkHexColor":"FFD98F","electronicConfiguration":"[Kr] 4d10 5s2","electronegativity":1.69,"atomicRadius":148,"ionRadius":"95 (+2)","vanDelWaalsRadius":158,"ionizationEnergy":868,"electronAffinity":0,"oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":594,"boilingPoint":1040,"density":8.65,"groupBlock":"transition metal","yearDiscovered":1817},
    {"atomicNumber":49,"symbol":"In","name":"Indium","atomicMass":114.818,"cpkHexColor":"A67573","electronicConfiguration":"[Kr] 4d10 5s2 5p1","electronegativity":1.78,"atomicRadius":144,"ionRadius":"80 (+3)","vanDelWaalsRadius":193,"ionizationEnergy":558,"electronAffinity":-29,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":430,"boilingPoint":2345,"density":7.31,"groupBlock":"metal","yearDiscovered":1863},
    {"atomicNumber":50,"symbol":"Sn","name":"Tin","atomicMass":118.710,"cpkHexColor":668080,"electronicConfiguration":"[Kr] 4d10 5s2 5p2","electronegativity":1.96,"atomicRadius":141,"ionRadius":"112 (+2)","vanDelWaalsRadius":217,"ionizationEnergy":709,"electronAffinity":-107,"oxidationStates":"-4, 2, 4","standardState":"solid","bondingType":"metallic","meltingPoint":505,"boilingPoint":2875,"density":7.31,"groupBlock":"metal","yearDiscovered":"Ancient"},
    {"atomicNumber":51,"symbol":"Sb","name":"Antimony","atomicMass":121.760,"cpkHexColor":"9E63B5","electronicConfiguration":"[Kr] 4d10 5s2 5p3","electronegativity":2.05,"atomicRadius":138,"ionRadius":"76 (+3)","vanDelWaalsRadius":"","ionizationEnergy":834,"electronAffinity":-103,"oxidationStates":"-3, 3, 5","standardState":"solid","bondingType":"metallic","meltingPoint":904,"boilingPoint":1860,"density":6.697,"groupBlock":"metalloid","yearDiscovered":"Ancient"},
    {"atomicNumber":52,"symbol":"Te","name":"Tellurium","atomicMass":127.60,"cpkHexColor":"D47A00","electronicConfiguration":"[Kr] 4d10 5s2 5p4","electronegativity":2.1,"atomicRadius":135,"ionRadius":"221 (-2)","vanDelWaalsRadius":206,"ionizationEnergy":869,"electronAffinity":-190,"oxidationStates":"-2, 2, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":723,"boilingPoint":1261,"density":6.24,"groupBlock":"metalloid","yearDiscovered":1782},
    {"atomicNumber":53,"symbol":"I","name":"Iodine","atomicMass":126.90447,"cpkHexColor":940094,"electronicConfiguration":"[Kr] 4d10 5s2 5p5","electronegativity":2.66,"atomicRadius":133,"ionRadius":"220 (-1)","vanDelWaalsRadius":198,"ionizationEnergy":1008,"electronAffinity":-295,"oxidationStates":"-1, 1, 3, 5, 7","standardState":"solid","bondingType":"covalent network","meltingPoint":387,"boilingPoint":457,"density":4.94,"groupBlock":"halogen","yearDiscovered":1811},
    {"atomicNumber":54,"symbol":"Xe","name":"Xenon","atomicMass":131.293,"cpkHexColor":"429EB0","electronicConfiguration":"[Kr] 4d10 5s2 5p6","electronegativity":"","atomicRadius":130,"ionRadius":"48 (+8)","vanDelWaalsRadius":216,"ionizationEnergy":1170,"electronAffinity":0,"oxidationStates":"2, 4, 6, 8","standardState":"gas","bondingType":"atomic","meltingPoint":161,"boilingPoint":165,"density":0.0059,"groupBlock":"noble gas","yearDiscovered":1898},
    {"atomicNumber":55,"symbol":"Cs","name":"Cesium","atomicMass":132.9054519,"cpkHexColor":"57178F","electronicConfiguration":"[Xe] 6s1","electronegativity":0.79,"atomicRadius":225,"ionRadius":"167 (+1)","vanDelWaalsRadius":"","ionizationEnergy":376,"electronAffinity":-46,"oxidationStates":1,"standardState":"solid","bondingType":"metallic","meltingPoint":302,"boilingPoint":944,"density":1.879,"groupBlock":"alkali metal","yearDiscovered":1860},
    {"atomicNumber":56,"symbol":"Ba","name":"Barium","atomicMass":137.327,"cpkHexColor":"00C900","electronicConfiguration":"[Xe] 6s2","electronegativity":0.89,"atomicRadius":198,"ionRadius":"135 (+2)","vanDelWaalsRadius":"","ionizationEnergy":503,"electronAffinity":-14,"oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":1000,"boilingPoint":2143,"density":3.51,"groupBlock":"alkaline earth metal","yearDiscovered":1808},
    {"atomicNumber":57,"symbol":"La","name":"Lanthanum","atomicMass":138.90547,"cpkHexColor":"70D4FF","electronicConfiguration":"[Xe] 5d1 6s2","electronegativity":1.1,"atomicRadius":169,"ionRadius":"103.2 (+3)","vanDelWaalsRadius":"","ionizationEnergy":538,"electronAffinity":-48,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1193,"boilingPoint":3737,"density":6.146,"groupBlock":"lanthanoid","yearDiscovered":1839},
    {"atomicNumber":58,"symbol":"Ce","name":"Cerium","atomicMass":140.116,"cpkHexColor":"FFFFC7","electronicConfiguration":"[Xe] 4f1 5d1 6s2","electronegativity":1.12,"atomicRadius":"","ionRadius":"102 (+3)","vanDelWaalsRadius":"","ionizationEnergy":534,"electronAffinity":-50,"oxidationStates":"2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1071,"boilingPoint":3633,"density":6.689,"groupBlock":"lanthanoid","yearDiscovered":1803},
    {"atomicNumber":59,"symbol":"Pr","name":"Praseodymium","atomicMass":140.90765,"cpkHexColor":"D9FFC7","electronicConfiguration":"[Xe] 4f3 6s2","electronegativity":1.13,"atomicRadius":"","ionRadius":"99 (+3)","vanDelWaalsRadius":"","ionizationEnergy":527,"electronAffinity":-50,"oxidationStates":"2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1204,"boilingPoint":3563,"density":6.64,"groupBlock":"lanthanoid","yearDiscovered":1885},
    {"atomicNumber":60,"symbol":"Nd","name":"Neodymium","atomicMass":144.242,"cpkHexColor":"C7FFC7","electronicConfiguration":"[Xe] 4f4 6s2","electronegativity":1.14,"atomicRadius":"","ionRadius":"129 (+2)","vanDelWaalsRadius":"","ionizationEnergy":533,"electronAffinity":-50,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1294,"boilingPoint":3373,"density":7.01,"groupBlock":"lanthanoid","yearDiscovered":1885},
    {"atomicNumber":61,"symbol":"Pm","name":"Promethium","atomicMass":145,"cpkHexColor":"A3FFC7","electronicConfiguration":"[Xe] 4f5 6s2","electronegativity":1.13,"atomicRadius":"","ionRadius":"97 (+3)","vanDelWaalsRadius":"","ionizationEnergy":540,"electronAffinity":-50,"oxidationStates":3,"standardState":"solid","bondingType":"metallic","meltingPoint":1373,"boilingPoint":3273,"density":7.264,"groupBlock":"lanthanoid","yearDiscovered":1947},
    {"atomicNumber":62,"symbol":"Sm","name":"Samarium","atomicMass":150.36,"cpkHexColor":"8FFFC7","electronicConfiguration":"[Xe] 4f6 6s2","electronegativity":1.17,"atomicRadius":"","ionRadius":"122 (+2)","vanDelWaalsRadius":"","ionizationEnergy":545,"electronAffinity":-50,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1345,"boilingPoint":2076,"density":7.353,"groupBlock":"lanthanoid","yearDiscovered":1853},
    {"atomicNumber":63,"symbol":"Eu","name":"Europium","atomicMass":151.964,"cpkHexColor":"61FFC7","electronicConfiguration":"[Xe] 4f7 6s2","electronegativity":1.2,"atomicRadius":"","ionRadius":"117 (+2)","vanDelWaalsRadius":"","ionizationEnergy":547,"electronAffinity":-50,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1095,"boilingPoint":1800,"density":5.244,"groupBlock":"lanthanoid","yearDiscovered":1901},
    {"atomicNumber":64,"symbol":"Gd","name":"Gadolinium","atomicMass":157.25,"cpkHexColor":"45FFC7","electronicConfiguration":"[Xe] 4f7 5d1 6s2","electronegativity":1.2,"atomicRadius":"","ionRadius":"93.8 (+3)","vanDelWaalsRadius":"","ionizationEnergy":593,"electronAffinity":-50,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1586,"boilingPoint":3523,"density":7.901,"groupBlock":"lanthanoid","yearDiscovered":1880},
    {"atomicNumber":65,"symbol":"Tb","name":"Terbium","atomicMass":158.92535,"cpkHexColor":"30FFC7","electronicConfiguration":"[Xe] 4f9 6s2","electronegativity":1.2,"atomicRadius":"","ionRadius":"92.3 (+3)","vanDelWaalsRadius":"","ionizationEnergy":566,"electronAffinity":-50,"oxidationStates":"1, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1629,"boilingPoint":3503,"density":8.219,"groupBlock":"lanthanoid","yearDiscovered":1843},
    {"atomicNumber":66,"symbol":"Dy","name":"Dysprosium","atomicMass":162.500,"cpkHexColor":"1FFFC7","electronicConfiguration":"[Xe] 4f10 6s2","electronegativity":1.22,"atomicRadius":"","ionRadius":"107 (+2)","vanDelWaalsRadius":"","ionizationEnergy":573,"electronAffinity":-50,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1685,"boilingPoint":2840,"density":8.551,"groupBlock":"lanthanoid","yearDiscovered":1886},
    {"atomicNumber":67,"symbol":"Ho","name":"Holmium","atomicMass":164.93032,"cpkHexColor":"00FF9C","electronicConfiguration":"[Xe] 4f11 6s2","electronegativity":1.23,"atomicRadius":"","ionRadius":"90.1 (+3)","vanDelWaalsRadius":"","ionizationEnergy":581,"electronAffinity":-50,"oxidationStates":3,"standardState":"solid","bondingType":"metallic","meltingPoint":1747,"boilingPoint":2973,"density":8.795,"groupBlock":"lanthanoid","yearDiscovered":1878},
    {"atomicNumber":68,"symbol":"Er","name":"Erbium","atomicMass":167.259,"cpkHexColor":"00E675","electronicConfiguration":"[Xe] 4f12 6s2","electronegativity":1.24,"atomicRadius":"","ionRadius":"89 (+3)","vanDelWaalsRadius":"","ionizationEnergy":589,"electronAffinity":-50,"oxidationStates":3,"standardState":"solid","bondingType":"metallic","meltingPoint":1770,"boilingPoint":3141,"density":9.066,"groupBlock":"lanthanoid","yearDiscovered":1842},
    {"atomicNumber":69,"symbol":"Tm","name":"Thulium","atomicMass":168.93421,"cpkHexColor":"00D452","electronicConfiguration":"[Xe] 4f13 6s2","electronegativity":1.25,"atomicRadius":"","ionRadius":"103 (+2)","vanDelWaalsRadius":"","ionizationEnergy":597,"electronAffinity":-50,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1818,"boilingPoint":2223,"density":9.321,"groupBlock":"lanthanoid","yearDiscovered":1879},
    {"atomicNumber":70,"symbol":"Yb","name":"Ytterbium","atomicMass":173.054,"cpkHexColor":"00BF38","electronicConfiguration":"[Xe] 4f14 6s2","electronegativity":1.1,"atomicRadius":"","ionRadius":"102 (+2)","vanDelWaalsRadius":"","ionizationEnergy":603,"electronAffinity":-50,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1092,"boilingPoint":1469,"density":6.57,"groupBlock":"lanthanoid","yearDiscovered":1878},
    {"atomicNumber":71,"symbol":"Lu","name":"Lutetium","atomicMass":174.9668,"cpkHexColor":"00AB24","electronicConfiguration":"[Xe] 4f14 5d1 6s2","electronegativity":1.27,"atomicRadius":160,"ionRadius":"86.1 (+3)","vanDelWaalsRadius":"","ionizationEnergy":524,"electronAffinity":-50,"oxidationStates":3,"standardState":"solid","bondingType":"metallic","meltingPoint":1936,"boilingPoint":3675,"density":9.841,"groupBlock":"lanthanoid","yearDiscovered":1907},
    {"atomicNumber":72,"symbol":"Hf","name":"Hafnium","atomicMass":178.49,"cpkHexColor":"4DC2FF","electronicConfiguration":"[Xe] 4f14 5d2 6s2","electronegativity":1.3,"atomicRadius":150,"ionRadius":"71 (+4)","vanDelWaalsRadius":"","ionizationEnergy":659,"electronAffinity":0,"oxidationStates":"2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":2506,"boilingPoint":4876,"density":13.31,"groupBlock":"transition metal","yearDiscovered":1923},
    {"atomicNumber":73,"symbol":"Ta","name":"Tantalum","atomicMass":180.94788,"cpkHexColor":"4DA6FF","electronicConfiguration":"[Xe] 4f14 5d3 6s2","electronegativity":1.5,"atomicRadius":138,"ionRadius":"72 (+3)","vanDelWaalsRadius":"","ionizationEnergy":761,"electronAffinity":-31,"oxidationStates":"-1, 2, 3, 4, 5","standardState":"solid","bondingType":"metallic","meltingPoint":3290,"boilingPoint":5731,"density":16.65,"groupBlock":"transition metal","yearDiscovered":1802},
    {"atomicNumber":74,"symbol":"W","name":"Tungsten","atomicMass":183.84,"cpkHexColor":"2194D6","electronicConfiguration":"[Xe] 4f14 5d4 6s2","electronegativity":2.36,"atomicRadius":146,"ionRadius":"66 (+4)","vanDelWaalsRadius":"","ionizationEnergy":770,"electronAffinity":-79,"oxidationStates":"-2, -1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":3695,"boilingPoint":5828,"density":19.25,"groupBlock":"transition metal","yearDiscovered":1783},
    {"atomicNumber":75,"symbol":"Re","name":"Rhenium","atomicMass":186.207,"cpkHexColor":"267DAB","electronicConfiguration":"[Xe] 4f14 5d5 6s2","electronegativity":1.9,"atomicRadius":159,"ionRadius":"63 (+4)","vanDelWaalsRadius":"","ionizationEnergy":760,"electronAffinity":-15,"oxidationStates":"-3, -1, 1, 2, 3, 4, 5, 6, 7","standardState":"solid","bondingType":"metallic","meltingPoint":3459,"boilingPoint":5869,"density":21.02,"groupBlock":"transition metal","yearDiscovered":1925},
    {"atomicNumber":76,"symbol":"Os","name":"Osmium","atomicMass":190.23,"cpkHexColor":266696,"electronicConfiguration":"[Xe] 4f14 5d6 6s2","electronegativity":2.2,"atomicRadius":128,"ionRadius":"63 (+4)","vanDelWaalsRadius":"","ionizationEnergy":840,"electronAffinity":-106,"oxidationStates":"-2, -1, 1, 2, 3, 4, 5, 6, 7, 8","standardState":"solid","bondingType":"metallic","meltingPoint":3306,"boilingPoint":5285,"density":22.61,"groupBlock":"transition metal","yearDiscovered":1803},
    {"atomicNumber":77,"symbol":"Ir","name":"Iridium","atomicMass":192.217,"cpkHexColor":175487,"electronicConfiguration":"[Xe] 4f14 5d7 6s2","electronegativity":2.2,"atomicRadius":137,"ionRadius":"68 (+3)","vanDelWaalsRadius":"","ionizationEnergy":880,"electronAffinity":-151,"oxidationStates":"-3, -1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":2739,"boilingPoint":4701,"density":22.65,"groupBlock":"transition metal","yearDiscovered":1803},
    {"atomicNumber":78,"symbol":"Pt","name":"Platinum","atomicMass":195.084,"cpkHexColor":"D0D0E0","electronicConfiguration":"[Xe] 4f14 5d9 6s1","electronegativity":2.28,"atomicRadius":128,"ionRadius":"86 (+2)","vanDelWaalsRadius":175,"ionizationEnergy":870,"electronAffinity":-205,"oxidationStates":"2, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":2041,"boilingPoint":4098,"density":21.09,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
    {"atomicNumber":79,"symbol":"Au","name":"Gold","atomicMass":196.966569,"cpkHexColor":"FFD123","electronicConfiguration":"[Xe] 4f14 5d10 6s1","electronegativity":2.54,"atomicRadius":144,"ionRadius":"137 (+1)","vanDelWaalsRadius":166,"ionizationEnergy":890,"electronAffinity":-223,"oxidationStates":"-1, 1, 2, 3, 5","standardState":"solid","bondingType":"metallic","meltingPoint":1337,"boilingPoint":3129,"density":19.3,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
    {"atomicNumber":80,"symbol":"Hg","name":"Mercury","atomicMass":200.59,"cpkHexColor":"B8B8D0","electronicConfiguration":"[Xe] 4f14 5d10 6s2","electronegativity":2,"atomicRadius":149,"ionRadius":"119 (+1)","vanDelWaalsRadius":155,"ionizationEnergy":1007,"electronAffinity":0,"oxidationStates":"1, 2, 4","standardState":"liquid","bondingType":"metallic","meltingPoint":234,"boilingPoint":630,"density":13.534,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
    {"atomicNumber":81,"symbol":"Tl","name":"Thallium","atomicMass":204.3833,"cpkHexColor":"A6544D","electronicConfiguration":"[Xe] 4f14 5d10 6s2 6p1","electronegativity":2.04,"atomicRadius":148,"ionRadius":"150 (+1)","vanDelWaalsRadius":196,"ionizationEnergy":589,"electronAffinity":-19,"oxidationStates":"1, 3","standardState":"solid","bondingType":"metallic","meltingPoint":577,"boilingPoint":1746,"density":11.85,"groupBlock":"metal","yearDiscovered":1861},
    {"atomicNumber":82,"symbol":"Pb","name":"Lead","atomicMass":207.2,"cpkHexColor":575961,"electronicConfiguration":"[Xe] 4f14 5d10 6s2 6p2","electronegativity":2.33,"atomicRadius":147,"ionRadius":"119 (+2)","vanDelWaalsRadius":202,"ionizationEnergy":716,"electronAffinity":-35,"oxidationStates":"-4, 2, 4","standardState":"solid","bondingType":"metallic","meltingPoint":601,"boilingPoint":2022,"density":11.34,"groupBlock":"metal","yearDiscovered":"Ancient"},
    {"atomicNumber":83,"symbol":"Bi","name":"Bismuth","atomicMass":208.98040,"cpkHexColor":"9E4FB5","electronicConfiguration":"[Xe] 4f14 5d10 6s2 6p3","electronegativity":2.02,"atomicRadius":146,"ionRadius":"103 (+3)","vanDelWaalsRadius":"","ionizationEnergy":703,"electronAffinity":-91,"oxidationStates":"-3, 3, 5","standardState":"solid","bondingType":"metallic","meltingPoint":544,"boilingPoint":1837,"density":9.78,"groupBlock":"metal","yearDiscovered":"Ancient"},
    {"atomicNumber":84,"symbol":"Po","name":"Polonium","atomicMass":209,"cpkHexColor":"AB5C00","electronicConfiguration":"[Xe] 4f14 5d10 6s2 6p4","electronegativity":2,"atomicRadius":"","ionRadius":"94 (+4)","vanDelWaalsRadius":"","ionizationEnergy":812,"electronAffinity":-183,"oxidationStates":"-2, 2, 4, 6","standardState":"solid","bondingType":"metallic","meltingPoint":527,"boilingPoint":1235,"density":9.196,"groupBlock":"metalloid","yearDiscovered":1898},
    {"atomicNumber":85,"symbol":"At","name":"Astatine","atomicMass":210,"cpkHexColor":"754F45","electronicConfiguration":"[Xe] 4f14 5d10 6s2 6p5","electronegativity":2.2,"atomicRadius":"","ionRadius":"62 (+7)","vanDelWaalsRadius":"","ionizationEnergy":920,"electronAffinity":-270,"oxidationStates":"-1, 1, 3, 5","standardState":"solid","bondingType":"covalent network","meltingPoint":575,"boilingPoint":"","density":"","groupBlock":"halogen","yearDiscovered":1940},
    {"atomicNumber":86,"symbol":"Rn","name":"Radon","atomicMass":222,"cpkHexColor":428296,"electronicConfiguration":"[Xe] 4f14 5d10 6s2 6p6","electronegativity":"","atomicRadius":145,"ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":1037,"electronAffinity":"","oxidationStates":2,"standardState":"gas","bondingType":"atomic","meltingPoint":202,"boilingPoint":211,"density":0.00973,"groupBlock":"noble gas","yearDiscovered":1900},
    {"atomicNumber":87,"symbol":"Fr","name":"Francium","atomicMass":223,"cpkHexColor":420066,"electronicConfiguration":"[Rn] 7s1","electronegativity":0.7,"atomicRadius":"","ionRadius":"180 (+1)","vanDelWaalsRadius":"","ionizationEnergy":380,"electronAffinity":"","oxidationStates":1,"standardState":"solid","bondingType":"metallic","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"alkali metal","yearDiscovered":1939},
    {"atomicNumber":88,"symbol":"Ra","name":"Radium","atomicMass":226,"cpkHexColor":"007D00","electronicConfiguration":"[Rn] 7s2","electronegativity":0.9,"atomicRadius":"","ionRadius":"148 (+2)","vanDelWaalsRadius":"","ionizationEnergy":509,"electronAffinity":"","oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":973,"boilingPoint":2010,"density":5,"groupBlock":"alkaline earth metal","yearDiscovered":1898},
    {"atomicNumber":89,"symbol":"Ac","name":"Actinium","atomicMass":227,"cpkHexColor":"70ABFA","electronicConfiguration":"[Rn] 6d1 7s2","electronegativity":1.1,"atomicRadius":"","ionRadius":"112 (+3)","vanDelWaalsRadius":"","ionizationEnergy":499,"electronAffinity":"","oxidationStates":3,"standardState":"solid","bondingType":"metallic","meltingPoint":1323,"boilingPoint":3473,"density":10.07,"groupBlock":"actinoid","yearDiscovered":1899},
    {"atomicNumber":90,"symbol":"Th","name":"Thorium","atomicMass":232.03806,"cpkHexColor":"00BAFF","electronicConfiguration":"[Rn] 6d2 7s2","electronegativity":1.3,"atomicRadius":"","ionRadius":"94 (+4)","vanDelWaalsRadius":"","ionizationEnergy":587,"electronAffinity":"","oxidationStates":"2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":2023,"boilingPoint":5093,"density":11.724,"groupBlock":"actinoid","yearDiscovered":1828},
    {"atomicNumber":91,"symbol":"Pa","name":"Protactinium","atomicMass":231.03588,"cpkHexColor":"00A1FF","electronicConfiguration":"[Rn] 5f2 6d1 7s2","electronegativity":1.5,"atomicRadius":"","ionRadius":"104 (+3)","vanDelWaalsRadius":"","ionizationEnergy":568,"electronAffinity":"","oxidationStates":"3, 4, 5","standardState":"solid","bondingType":"metallic","meltingPoint":1845,"boilingPoint":4273,"density":15.37,"groupBlock":"actinoid","yearDiscovered":1913},
    {"atomicNumber":92,"symbol":"U","name":"Uranium","atomicMass":238.02891,"cpkHexColor":"008FFF","electronicConfiguration":"[Rn] 5f3 6d1 7s2","electronegativity":1.38,"atomicRadius":"","ionRadius":"102.5 (+3)","vanDelWaalsRadius":186,"ionizationEnergy":598,"electronAffinity":"","oxidationStates":"3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":1408,"boilingPoint":4200,"density":19.05,"groupBlock":"actinoid","yearDiscovered":1789},
    {"atomicNumber":93,"symbol":"Np","name":"Neptunium","atomicMass":237,"cpkHexColor":"0080FF","electronicConfiguration":"[Rn] 5f4 6d1 7s2","electronegativity":1.36,"atomicRadius":"","ionRadius":"110 (+2)","vanDelWaalsRadius":"","ionizationEnergy":605,"electronAffinity":"","oxidationStates":"3, 4, 5, 6, 7","standardState":"solid","bondingType":"metallic","meltingPoint":917,"boilingPoint":4273,"density":20.45,"groupBlock":"actinoid","yearDiscovered":1940},
    {"atomicNumber":94,"symbol":"Pu","name":"Plutonium","atomicMass":244,"cpkHexColor":"006BFF","electronicConfiguration":"[Rn] 5f6 7s2","electronegativity":1.28,"atomicRadius":"","ionRadius":"100 (+3)","vanDelWaalsRadius":"","ionizationEnergy":585,"electronAffinity":"","oxidationStates":"3, 4, 5, 6, 7","standardState":"solid","bondingType":"metallic","meltingPoint":913,"boilingPoint":3503,"density":19.816,"groupBlock":"actinoid","yearDiscovered":1940},
    {"atomicNumber":95,"symbol":"Am","name":"Americium","atomicMass":243,"cpkHexColor":"545CF2","electronicConfiguration":"[Rn] 5f7 7s2","electronegativity":1.3,"atomicRadius":"","ionRadius":"126 (+2)","vanDelWaalsRadius":"","ionizationEnergy":578,"electronAffinity":"","oxidationStates":"2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":1449,"boilingPoint":2284,"density":"","groupBlock":"actinoid","yearDiscovered":1944},
    {"atomicNumber":96,"symbol":"Cm","name":"Curium","atomicMass":247,"cpkHexColor":"785CE3","electronicConfiguration":"[Rn] 5f7 6d1 7s2","electronegativity":1.3,"atomicRadius":"","ionRadius":"97 (+3)","vanDelWaalsRadius":"","ionizationEnergy":581,"electronAffinity":"","oxidationStates":"3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1618,"boilingPoint":3383,"density":13.51,"groupBlock":"actinoid","yearDiscovered":1944},
    {"atomicNumber":97,"symbol":"Bk","name":"Berkelium","atomicMass":247,"cpkHexColor":"8A4FE3","electronicConfiguration":"[Rn] 5f9 7s2","electronegativity":1.3,"atomicRadius":"","ionRadius":"96 (+3)","vanDelWaalsRadius":"","ionizationEnergy":601,"electronAffinity":"","oxidationStates":"3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1323,"boilingPoint":"","density":14.78,"groupBlock":"actinoid","yearDiscovered":1949},
    {"atomicNumber":98,"symbol":"Cf","name":"Californium","atomicMass":251,"cpkHexColor":"A136D4","electronicConfiguration":"[Rn] 5f10 7s2","electronegativity":1.3,"atomicRadius":"","ionRadius":"95 (+3)","vanDelWaalsRadius":"","ionizationEnergy":608,"electronAffinity":"","oxidationStates":"2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1173,"boilingPoint":"","density":15.1,"groupBlock":"actinoid","yearDiscovered":1950},
    {"atomicNumber":99,"symbol":"Es","name":"Einsteinium","atomicMass":252,"cpkHexColor":"B31FD4","electronicConfiguration":"[Rn] 5f11 7s2","electronegativity":1.3,"atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":619,"electronAffinity":"","oxidationStates":"2, 3","standardState":"solid","bondingType":"","meltingPoint":1133,"boilingPoint":"","density":"","groupBlock":"actinoid","yearDiscovered":1952},
    {"atomicNumber":100,"symbol":"Fm","name":"Fermium","atomicMass":257,"cpkHexColor":"B31FBA","electronicConfiguration":"[Rn] 5f12 7s2","electronegativity":1.3,"atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":627,"electronAffinity":"","oxidationStates":"2, 3","standardState":"","bondingType":"","meltingPoint":1800,"boilingPoint":"","density":"","groupBlock":"actinoid","yearDiscovered":1952},
    {"atomicNumber":101,"symbol":"Md","name":"Mendelevium","atomicMass":258,"cpkHexColor":"B30DA6","electronicConfiguration":"[Rn] 5f13 7s2","electronegativity":1.3,"atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":635,"electronAffinity":"","oxidationStates":"2, 3","standardState":"","bondingType":"","meltingPoint":1100,"boilingPoint":"","density":"","groupBlock":"actinoid","yearDiscovered":1955},
    {"atomicNumber":102,"symbol":"No","name":"Nobelium","atomicMass":259,"cpkHexColor":"BD0D87","electronicConfiguration":"[Rn] 5f14 7s2","electronegativity":1.3,"atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":642,"electronAffinity":"","oxidationStates":"2, 3","standardState":"","bondingType":"","meltingPoint":1100,"boilingPoint":"","density":"","groupBlock":"actinoid","yearDiscovered":1957},
    {"atomicNumber":103,"symbol":"Lr","name":"Lawrencium","atomicMass":262,"cpkHexColor":"C70066","electronicConfiguration":"[Rn] 5f14 7s2 7p1","electronegativity":1.3,"atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":3,"standardState":"","bondingType":"","meltingPoint":1900,"boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1961},
    {"atomicNumber":104,"symbol":"Rf","name":"Rutherfordium","atomicMass":267,"cpkHexColor":"CC0059","electronicConfiguration":"[Rn] 5f14 6d2 7s2","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":4,"standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1969},
    {"atomicNumber":105,"symbol":"Db","name":"Dubnium","atomicMass":268,"cpkHexColor":"D1004F","electronicConfiguration":"[Rn] 5f14 6d3 7s2","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1967},
    {"atomicNumber":106,"symbol":"Sg","name":"Seaborgium","atomicMass":271,"cpkHexColor":"D90045","electronicConfiguration":"[Rn] 5f14 6d4 7s2","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1974},
    {"atomicNumber":107,"symbol":"Bh","name":"Bohrium","atomicMass":272,"cpkHexColor":"E00038","electronicConfiguration":"[Rn] 5f14 6d5 7s2","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1976},
    {"atomicNumber":108,"symbol":"Hs","name":"Hassium","atomicMass":270,"cpkHexColor":"E6002E","electronicConfiguration":"[Rn] 5f14 6d6 7s2","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1984},
    {"atomicNumber":109,"symbol":"Mt","name":"Meitnerium","atomicMass":276,"cpkHexColor":"EB0026","electronicConfiguration":"[Rn] 5f14 6d7 7s2","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1982},
    {"atomicNumber":110,"symbol":"Ds","name":"Darmstadtium","atomicMass":281,"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d9 7s1","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1994},
    {"atomicNumber":111,"symbol":"Rg","name":"Roentgenium","atomicMass":280,"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s1","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1994},
    {"atomicNumber":112,"symbol":"Cn","name":"Copernicium","atomicMass":285,"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1996},
    {"atomicNumber":113,"symbol":"Nh","name":"Nihonium","atomicMass":284,"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2 7p1","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"post-transition metal","yearDiscovered":2003},
    {"atomicNumber":114,"symbol":"Fl","name":"Flerovium","atomicMass":289,"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2 7p2","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"post-transition metal","yearDiscovered":1998},
    {"atomicNumber":115,"symbol":"Mc","name":"Moscovium","atomicMass":288,"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2 7p3","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"post-transition metal","yearDiscovered":2003},
    {"atomicNumber":116,"symbol":"Lv","name":"Livermorium","atomicMass":293,"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2 7p4","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"post-transition metal","yearDiscovered":2000},
    {"atomicNumber":117,"symbol":"Ts","name":"Tennessine","atomicMass":294,"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2 7p5","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"post-transition metal","yearDiscovered":2010},
    {"atomicNumber":118,"symbol":"Og","name":"Oganesson","atomicMass":294,"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2 7p6","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"noble gas","yearDiscovered":2002}
]

// data source: https://github.com/andrejewski/periodic-table/blob/master/data.json

    // /[₀-₉]/g
const Elemental = {
    get(element) {
        let result = typeof element === "object" ? elementData[element] : elementData[element - 1];
        if(result == undefined) elementData.forEach(function (el) {
            if(el.symbol == element) result = el;
        });

        if(result == undefined) elementData.forEach(function (el) {
            if(el.name == element) result = el;
        });

        if(result == undefined) return "Not Found"

        let resultKeys = Object.keys(result);
        for(let i = 0; i < resultKeys.length; i++){
            if(result[resultKeys[i]] == "") result[resultKeys[i]] = "No Data"
        }
        return result
    },

    simplify(compound, options){
        let array = compound.split("")
        options = options || {};

        options.joinedResult = options.joinedResult || false;
        options.resultOnly = options.resultOnly || false;
        options.quantifyResult = options.quantifyResult || false;
        let tokenized = [];

        
        let errors = [];

        let coefficient = 1;

        for(let i = 0; i < array.length; i++){
            if(array[i] == " "){
                // split at space
                let num = compound.split(" ")[0]
                array = compound.split(" ")[1].split("")
                if(/[a-zA-Z]/g.test(num) || num == "0") errors.push(`Parse Error: Invalid Coefficient '${num}'`)

                coefficient = num
            }

        }

        for(let i = 0; i < array.length; i++){
            if(/[0-9₀-₉]/g.test(array[i])){
                let num = array[i]
                if(/[₀-₉]/g.test(array[i])) num = array[i].charCodeAt(0) - 8320
                array[i] = num;
            }
        }

        let pairing = 0;

        for(i = 0; i < array.length; i++){
            let token = {}
            token.value = array[i]
            token.type = "unknown"

            if(/[A-Z]/g.test(token.value)) token.type = "el"
            if(/[a-z]/g.test(token.value)) token.type = "el-cont"

            if(/[0-9]/g.test(token.value)) token.type = "num"

            if(token.value == "(") token.type = "open"
            if(token.value == ")") token.type = "close"

            if(token.value == "(") pairing++

            token.pairing = pairing

            if(token.value == ")") pairing--

            tokenized.push(token)
        }

        for(i = 0; i < tokenized.length; i++){
            let token = tokenized[i]
            if(token.type == "el-cont"){
                if(tokenized[i - 1] !== undefined && tokenized[i - 1].type == "el"){
                    tokenized[i - 1].value += token.value
                    tokenized.splice(i, 1)
                    i--
                } else {
                    errors.push(`Parse Error: Unexpected character '${token.value}'`)
                }
            }
        }

        for(i = 0; i < tokenized.length; i++){
            let token = tokenized[i]
            if(token.type == "el"){
                token.sub = 1
                if(this.get(token.value) == "Not Found"){
                    errors.push(`Parse Error: Unknown element '${token.value}'`)
                }
            }
        }

        for(i = 0; i < tokenized.length; i++){
            let token = tokenized[i]
            if(token.type == "num"){
                if(tokenized[i - 1] === undefined){
                    errors.push(`Parse Error: Unexpected subscript '${token.value}'`)
                } else {
                    if(tokenized[i - 1].type == "num"){
                        tokenized[i - 1].value += token.value
                        tokenized.splice(i, 1)
                        i--
                    }
                }
            }
        }

        for(i = 0; i < tokenized.length; i++){
            let token = tokenized[i]
            if(token.type == "num"){
                if(tokenized[i - 1] === undefined){
                    errors.push(`Parse Error: Unexpected subscript '${token.value}'`)
                } else {
                    if(tokenized[i - 1].type == "el" || tokenized[i - 1].type == "close"){
                        tokenized[i - 1].sub = token.value * 1;
                        if(tokenized[i - 1].sub == 0) errors.push(`Parse Error: 0 cannot be a subscript value '${token.value}'`)
                        tokenized.splice(i, 1)
                        i--
                    }
                }
            }

            
        }

        for(i = 0; i < tokenized.length; i++){
            let token = tokenized[i]
            if(token.type == 'unknown'){
                errors.push(`Parse Error: Unexpected character '${token.value}'`)
            }
        }
        
        tokenized.reverse()

        let pairings = []

        for(i = 0; i < tokenized.length; i++){
            let token = tokenized[i]
            if(token.type == "close"){
                pairings.push(token.pairing)
            }
        }

        for(i = 0; i < pairings.length; i++){
            let subscript = [];
            for(j = 0; j < tokenized.length; j++){
                let token = tokenized[j]
                if(token.type == "close"){
                    subscript.push(token.sub)
                }
                if(token.type == "open"){
                    subscript.pop();
                }
                if(token.type == "el"){
                    if(token.pairing >= pairings[i]){
                        let sub = 1;
                        
                        subscript.forEach(function (i) {
                            sub *= i
                        })
                        console.log(token.sub)
                        token.sub *= sub
                        if(isNaN(token.sub)) errors.push(`Parenthesis Error`)
                        
                        token.pairing--;
                    }
                }
            }
        }

        tokenized.reverse()
        
        if(errors.length > 0) return errors[0]
        else {
            for(i = 0; i < tokenized.length; i++){
                if(tokenized[i].type == "open" || tokenized[i].type == "close"){
                    tokenized.splice(i, 1)
                    i--
                }
            }

            let groupedElements = {}
            for(i = 0; i < tokenized.length; i++){
                if(groupedElements[tokenized[i].value] == undefined) groupedElements[tokenized[i].value] = 0
                groupedElements[tokenized[i].value] += tokenized[i].sub
            }

            // multiply each value in groupedElements by the coefficient
            for(i = 0; i < Object.keys(groupedElements).length; i++){
                let el = Object.keys(groupedElements)[i]
                let sub = groupedElements[el]
                groupedElements[el] = sub * coefficient
            }
                     

            let result = [];
            for(i = 0; i < Object.keys(groupedElements).length; i++){
                let el = Object.keys(groupedElements)[i]
                let sub = groupedElements[el]

                result.push(`${sub} ${this.get(el).name} (${el})`)
            }

            // sort result based on how big the number is
            result.sort(function (a, b) {
                let aNum = a.split(" ")[0]
                let bNum = b.split(" ")[0]
                return bNum - aNum
            })

            if(options.joinedResult) result = result.join(", ")
            if(options.quantifyResult) result = groupedElements

            let fancifiedCompound = compound.split("")
            for(i = 0; i < fancifiedCompound.length; i++){
                if(/[0-9]/g.test(fancifiedCompound[i])){
                    let sub = {"0":"₀", "1":"₁", "2":"₂", "3":"₃", "4":"₄", "5":"₅", "6":"₆", "7":"₇", "8":"₈", "9":"₉"}
                    fancifiedCompound[i] = sub[fancifiedCompound[i]]
                }
            }

            fancifiedCompound = fancifiedCompound.join("")
            let resultObj = {
                result: result,
                "original input": fancifiedCompound
            }

            if(options.resultOnly) resultObj = result
            return resultObj
        }
    },

    balance(equation, options){
        options = options || {};
        options.joinedResult = options.joinedResult || false;
        options.stringified = options.stringified || false;
        options.quantifyResult = options.quantifyResult || false;

        if(/->/g.test(equation) == false) return "Parse Error: Invalid Equation (Missing '->')"

        let reactantsCompounds = equation.split("->")[0].trim().split("+")
        let productsCompounds = equation.split("->")[1].trim().split("+")

        reactantsCompounds = reactantsCompounds.map(i => i.trim())
        productsCompounds = productsCompounds.map(i => i.trim())

        let reactants = {}
        let products = {}

        let errors = []

        if(productsCompounds[0] == "") return "Parse Error: Invalid Equation (Missing Products)"
        if(reactantsCompounds[reactantsCompounds.length - 1] == "") return "Parse Error: Invalid Equation (Missing Reactant)"
        if(productsCompounds[productsCompounds.length - 1] == "") return "Parse Error: Invalid Equation (Missing Product)"

        reactantsCompounds.forEach(function (compound, i) {
            let simplified = Elemental.simplify(compound, {quantifyResult: true, resultOnly: true})
            if(typeof simplified == "string"){
                errors.push(`Parse Error: ${simplified} (reactant ${compound})`);
            }

            if(errors.length > 0) return;

            for(i = 0; i < Object.keys(simplified).length; i++){
                if(reactants[Object.keys(simplified)[i]] == undefined) reactants[Object.keys(simplified)[i]] = 0;
                reactants[Object.keys(simplified)[i]] += Object.values(simplified)[i]
            }
        })

        productsCompounds.forEach(function (compound, i) {
            let simplified = Elemental.simplify(compound, {quantifyResult: true, resultOnly: true})
            if(typeof simplified == "string"){
                errors.push(`Parse Error: ${simplified} (product ${compound})`);
            }

            if(errors.length > 0) return;

            for(i = 0; i < Object.keys(simplified).length; i++){
                if(products[Object.keys(simplified)[i]] == undefined) products[Object.keys(simplified)[i]] = 0;
                products[Object.keys(simplified)[i]] += Object.values(simplified)[i]
            }
        })

        if(errors.length > 0) return errors[0];

        let balancedElements = []
        let excessElements = {}
        let generatedElements = {}
        let usedElements = {}

        let currentReactants = {...reactants}
        let currentProducts = {...products}

        // get the common elements
        let commonElements = []
        for(i = 0; i < Object.keys(reactants).length; i++){
            if(Object.keys(products).includes(Object.keys(reactants)[i])){
                commonElements.push(Object.keys(reactants)[i])
            }
        }

        for(i = 0; i < commonElements.length; i++){
            if(reactants[commonElements[i]] == products[commonElements[i]]){
                balancedElements.push(commonElements[i])
                usedElements[commonElements[i]] = reactants[commonElements[i]]
                delete reactants[commonElements[i]]
                delete products[commonElements[i]]
            }
        }
        commonElements = []
        for(i = 0; i < Object.keys(reactants).length; i++){
            if(Object.keys(products).includes(Object.keys(reactants)[i])){
                commonElements.push(Object.keys(reactants)[i])
            }
        }

        for(i = 0; i < commonElements.length; i++){
            let element = commonElements[i]
            let amount = reactants[element] - products[element]

            if(amount > 0) usedElements[element] = amount

            if(amount > 0){
                excessElements[element] = amount
            } else {
                generatedElements[element] = amount * -1
            }

            delete reactants[element]
            delete products[element]
        }

        for(i = 0; i < Object.keys(reactants).length; i++){
            excessElements[Object.keys(reactants)[i]] = Object.values(reactants)[i]
        }

        for(i = 0; i < Object.keys(products).length; i++){
            generatedElements[Object.keys(products)[i]] = Object.values(products)[i]
        }

        if(options.quantifyResult) return {excess: excessElements, generated: generatedElements, used: usedElements, balanced: balancedElements, reactants: currentReactants, products: currentProducts}


        let balancedElementsResult = []
        let usedElementsResult = []
        let excessElementsResult = []
        let generatedElementsResult = []
        
        for(i = 0; i < balancedElements.length; i++){
            balancedElementsResult.push(`${balancedElements[i]} (${Elemental.get(balancedElements[i]).name})`)
        }

        for(i = 0; i < Object.keys(usedElements).length; i++){
            usedElementsResult.push(`${usedElements[Object.keys(usedElements)[i]]} ${Object.keys(usedElements)[i]} (${Elemental.get(Object.keys(usedElements)[i]).name})`)
        }

        for(i = 0; i < Object.keys(excessElements).length; i++){
            excessElementsResult.push(`${excessElements[Object.keys(excessElements)[i]]} ${Object.keys(excessElements)[i]} (${Elemental.get(Object.keys(excessElements)[i]).name})`)
        }

        for(i = 0; i < Object.keys(generatedElements).length; i++){
            generatedElementsResult.push(`${generatedElements[Object.keys(generatedElements)[i]]} ${Object.keys(generatedElements)[i]} (${Elemental.get(Object.keys(generatedElements)[i]).name})`)
        }

        if(usedElementsResult.length == 0) usedElementsResult.push("none")
        if(excessElementsResult.length == 0) excessElementsResult.push("none")
        if(generatedElementsResult.length == 0) generatedElementsResult.push("none")

        if(options.stringified) options.joinedResult = true

        if(options.joinedResult){
            usedElementsResult = usedElementsResult.join(", ")
            excessElementsResult = excessElementsResult.join(", ")
            generatedElementsResult = generatedElementsResult.join(", ")
            balancedElementsResult = balancedElementsResult.join(", ")
            productsCompounds = productsCompounds.join(" + ")
            reactantsCompounds = reactantsCompounds.join(" + ")
        }

        let result = {
            used: usedElementsResult,
            excess: excessElementsResult,
            generated: generatedElementsResult,
            products: productsCompounds,
            reactants: reactantsCompounds,
            original: equation
        }

        if(options.stringified){
            let array = [];
            for(i = 0; i < Object.keys(result).length; i++){
                array.push(`${Object.keys(result)[i]}: ${Object.values(result)[i]}`)
            }

            return array.join("\n")
        }
        return result
    },

    protons(element){
        if(this.get(element) == "Not Found") return `not available`
        return this.get(element).atomicNumber
    },

    neutrons(element){
        if(this.get(element) == "Not Found") return `not available`
        let mass = this.get(element).atomicMass
        let protons = this.get(element).atomicNumber
        return parseInt(mass - protons)
    },

    electrons(element){
        return this.neutrons(element)
    },

    color(element, options){
        options = options || {}
        options.logPreview = options.logPreview || false
        if(this.get(element) == "Not Found") return `not available`
        let hex = this.get(element).cpkHexColor
        if(hex == "No Data") return `specified element has no hex color`
        if(options.logPreview) console.log(`${this.get(element).name} `+`%c########`, `background: #${hex}; color: #${hex}; border: 1px solid black;`);
        return "#" + this.get(element).cpkHexColor
    }
}