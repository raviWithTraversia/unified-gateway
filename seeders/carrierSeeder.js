const AirLineCode = require('../models/AirlineCode');

const carrier = [{
  "airlineCode": "KI",
  "airlineName": "Adam Air"
},
{
  "airlineCode": "Z7",
  "airlineName": "ADC Airlines"
},
{
  "airlineCode": "JP",
  "airlineName": "Adria Airways"
},
{
  "airlineCode": "9B",
  "airlineName": "AccessRail"
},
{
  "airlineCode": "3G",
  "airlineName": "3G-GAMBIA BIRD"
},
{
  "airlineCode": "9F",
  "airlineName": "9F"
},
{
  "airlineCode": "I8",
  "airlineName": "Aboriginal Air Services"
},
{
  "airlineCode": "RE",
  "airlineName": "Aer Arann Express"
},
{
  "airlineCode": "EE",
  "airlineName": "Aero Airlines"
},
{
  "airlineCode": "EI",
  "airlineName": "Aer Lingus PLC"
},
{
  "airlineCode": "E4",
  "airlineName": "Aero Asia Intl"
},
{
  "airlineCode": "QA",
  "airlineName": "Aero Caribe"
},
{
  "airlineCode": "EM",
  "airlineName": "Aero Benin"
},
{
  "airlineCode": "JR",
  "airlineName": "Aero California"
},
{
  "airlineCode": "P4",
  "airlineName": "Aero Lineas Sosa"
},
{
  "airlineCode": "HC",
  "airlineName": "Aero Tropics Air Service"
},
{
  "airlineCode": "DW",
  "airlineName": "Aero-Charter"
},
{
  "airlineCode": "AJ",
  "airlineName": "Aerocontractors"
},
{
  "airlineCode": "SU",
  "airlineName": "Aeroflot Airlines"
},
{
  "airlineCode": "KG",
  "airlineName": "Aerogaviota"
},
{
  "airlineCode": "AR",
  "airlineName": "Aerolineas Argentinas"
},
{
  "airlineCode": "2K",
  "airlineName": "Aerolineas GALAPAGOS"
},
{
  "airlineCode": "BQ",
  "airlineName": "Aeromar Airlines"
},
{
  "airlineCode": "5D",
  "airlineName": "Aerolitoral"
},
{
  "airlineCode": "VW",
  "airlineName": "Aeromar Airlines"
},
{
  "airlineCode": "OT",
  "airlineName": "Aeropelican"
},
{
  "airlineCode": "AM",
  "airlineName": "Aeromexico"
},
{
  "airlineCode": "VH",
  "airlineName": "Aeropostal Alas De Venezuela"
},
{
  "airlineCode": "P5",
  "airlineName": "AeroRepublica"
},
{
  "airlineCode": "5L",
  "airlineName": "Aerosur"
},
{
  "airlineCode": "VV",
  "airlineName": "Aerosvit Airlines"
},
{
  "airlineCode": "AW",
  "airlineName": "AFRICA WORLD AIRLINES"
},
{
  "airlineCode": "XU",
  "airlineName": "African Express Airways"
},
{
  "airlineCode": "ML",
  "airlineName": "African Transport"
},
{
  "airlineCode": "8U",
  "airlineName": "Afriqiyah Airways"
},
{
  "airlineCode": "X5",
  "airlineName": "Afrique Airlines"
},
{
  "airlineCode": "ZI",
  "airlineName": "Aigle Azur"
},
{
  "airlineCode": "AH",
  "airlineName": "Air Algerie"
},
{
  "airlineCode": "A6",
  "airlineName": "Air Alps Aviation"
},
{
  "airlineCode": "2Y",
  "airlineName": "Air Andaman"
},
{
  "airlineCode": "G9",
  "airlineName": "Air Arabia"
},
{
  "airlineCode": "DJ",
  "airlineName": "Air Asia Japan"
},
{
  "airlineCode": "A3",
  "airlineName": "Aegean Air"
},
{
  "airlineCode": "DF",
  "airlineName": "Aebal"
},
{
  "airlineCode": "UU",
  "airlineName": "Air Austral"
},
{
  "airlineCode": "W9",
  "airlineName": "Air Bagan"
},
{
  "airlineCode": "BT",
  "airlineName": "Air Baltic"
},
{
  "airlineCode": "AB",
  "airlineName": "Air Berlin"
},
{
  "airlineCode": "BP",
  "airlineName": "Air Botswana"
},
{
  "airlineCode": "2J",
  "airlineName": "Air Burkina"
},
{
  "airlineCode": "TY",
  "airlineName": "Air Caledonie"
},
{
  "airlineCode": "SB",
  "airlineName": "Air Calin"
},
{
  "airlineCode": "AC",
  "airlineName": "Air Canada"
},
{
  "airlineCode": "QK",
  "airlineName": "Air Canada Jazz"
},
{
  "airlineCode": "TX",
  "airlineName": "Air Caraibes"
},
{
  "airlineCode": "2S",
  "airlineName": "Air Carnival"
},
{
  "airlineCode": "NV",
  "airlineName": "Air Central"
},
{
  "airlineCode": "CV",
  "airlineName": "Air Chatham"
},
{
  "airlineCode": "A7",
  "airlineName": "Air Comet"
},
{
  "airlineCode": "DV",
  "airlineName": "Air Company SCAT"
},
{
  "airlineCode": "4F",
  "airlineName": "Air City"
},
{
  "airlineCode": "CA",
  "airlineName": "Air China"
},
{
  "airlineCode": "QC",
  "airlineName": "Air Corridor"
},
{
  "airlineCode": "LB",
  "airlineName": "Air Costa"
},
{
  "airlineCode": "YN",
  "airlineName": "Air Creebec"
},
{
  "airlineCode": "EN",
  "airlineName": "Air Dolomiti S P A"
},
{
  "airlineCode": "UX",
  "airlineName": "Air Europa"
},
{
  "airlineCode": "OF",
  "airlineName": "Air Finland"
},
{
  "airlineCode": "PE",
  "airlineName": "Air Europe SPA"
},
{
  "airlineCode": "AF",
  "airlineName": "Air France"
},
{
  "airlineCode": "GL",
  "airlineName": "Air Greenland"
},
{
  "airlineCode": "3S",
  "airlineName": "Air Guyane"
},
{
  "airlineCode": "LQ",
  "airlineName": "Air Guinea Cargo"
},
{
  "airlineCode": "NY",
  "airlineName": "Air Iceland"
},
{
  "airlineCode": "AI",
  "airlineName": "Air India"
},
{
  "airlineCode": "IX",
  "airlineName": "Air India Express"
},
{
  "airlineCode": "I5",
  "airlineName": "Air India Express (I5)"
},
{
  "airlineCode": "IC",
  "airlineName": "Air India IC"
},
{
  "airlineCode": "3H",
  "airlineName": "Air Inuit"
},
{
  "airlineCode": "I9",
  "airlineName": "Air Italy"
},
{
  "airlineCode": "VU",
  "airlineName": "Air Ivoire"
},
{
  "airlineCode": "JM",
  "airlineName": "Air Jamaica"
},
{
  "airlineCode": "J4",
  "airlineName": "Air Jamaica Express"
},
{
  "airlineCode": "NQ",
  "airlineName": "Air Japan"
},
{
  "airlineCode": "JS",
  "airlineName": "Air Koryo"
},
{
  "airlineCode": "DR",
  "airlineName": "Air Link Pty"
},
{
  "airlineCode": "TT",
  "airlineName": "Air Lithuania"
},
{
  "airlineCode": "L8",
  "airlineName": "Air Luxor GB"
},
{
  "airlineCode": "C2",
  "airlineName": "Air Luxor STP"
},
{
  "airlineCode": "KC",
  "airlineName": "Air Astana"
},
{
  "airlineCode": "4L",
  "airlineName": "Air Astana"
},
{
  "airlineCode": "KM",
  "airlineName": "Air Malta"
},
{
  "airlineCode": "QM",
  "airlineName": "Air Malawi"
},
{
  "airlineCode": "6T",
  "airlineName": "Air Mandalay"
},
{
  "airlineCode": "CW",
  "airlineName": "Air Marshall Islands"
},
{
  "airlineCode": "MR",
  "airlineName": "Air Mauritanie"
},
{
  "airlineCode": "MK",
  "airlineName": "Air Mauritius"
},
{
  "airlineCode": "ZV",
  "airlineName": "Air Midwest"
},
{
  "airlineCode": "9U",
  "airlineName": "Air Moldova"
},
{
  "airlineCode": "SW",
  "airlineName": "Air Namibia"
},
{
  "airlineCode": "NZ",
  "airlineName": "Air New Zealand"
},
{
  "airlineCode": "EH",
  "airlineName": "Air Nippon Network"
},
{
  "airlineCode": "EL",
  "airlineName": "Air Nippon"
},
{
  "airlineCode": "4N",
  "airlineName": "Air North"
},
{
  "airlineCode": "PX",
  "airlineName": "Air Niugini"
},
{
  "airlineCode": "TL",
  "airlineName": "Air North Regional"
},
{
  "airlineCode": "YW",
  "airlineName": "Air Nostrum"
},
{
  "airlineCode": "6X",
  "airlineName": "Air Odisha"
},
{
  "airlineCode": "AP",
  "airlineName": "Air One"
},
{
  "airlineCode": "UT",
  "airlineName": "Air Orient"
},
{
  "airlineCode": "FJ",
  "airlineName": "Air Pacific"
},
{
  "airlineCode": "OP",
  "airlineName": "Air Pegasus"
},
{
  "airlineCode": "GZ",
  "airlineName": "Air Rarotonga"
},
{
  "airlineCode": "PJ",
  "airlineName": "Air Saint-Pierre"
},
{
  "airlineCode": "V7",
  "airlineName": "Air Senegal"
},
{
  "airlineCode": "EX",
  "airlineName": "Air Santo Domingo"
},
{
  "airlineCode": "JU",
  "airlineName": "Air Serbia"
},
{
  "airlineCode": "X7",
  "airlineName": "Air Service"
},
{
  "airlineCode": "HM",
  "airlineName": "Air Seychelles"
},
{
  "airlineCode": "4D",
  "airlineName": "Air Sinai"
},
{
  "airlineCode": "GM",
  "airlineName": "Air Slovakia"
},
{
  "airlineCode": "ZP",
  "airlineName": "Air St Thomas"
},
{
  "airlineCode": "YI",
  "airlineName": "Air Sunshine"
},
{
  "airlineCode": "VT",
  "airlineName": "Air Tahiti"
},
{
  "airlineCode": "TN",
  "airlineName": "Air Tahiti Nui"
},
{
  "airlineCode": "T6",
  "airlineName": "Air swift"
},
{
  "airlineCode": "TC",
  "airlineName": "Air Tanzania"
},
{
  "airlineCode": "YT",
  "airlineName": "Air Togo"
},
{
  "airlineCode": "8T",
  "airlineName": "Air Tindi"
},
{
  "airlineCode": "TS",
  "airlineName": "Air Transat AT"
},
{
  "airlineCode": "JY",
  "airlineName": "Air Turks Caicos"
},
{
  "airlineCode": "U7",
  "airlineName": "Air Uganda"
},
{
  "airlineCode": "6U",
  "airlineName": "Air Ukraine"
},
{
  "airlineCode": "DO",
  "airlineName": "Air Vallee"
},
{
  "airlineCode": "V1",
  "airlineName": "Air Ventura"
},
{
  "airlineCode": "NF",
  "airlineName": "Air Vanuatu"
},
{
  "airlineCode": "6G",
  "airlineName": "Air Wales"
},
{
  "airlineCode": "ZW",
  "airlineName": "Air Wisconsin"
},
{
  "airlineCode": "UM",
  "airlineName": "Air Zimbabwe"
},
{
  "airlineCode": "AK",
  "airlineName": "AirAsia"
},
{
  "airlineCode": "D7",
  "airlineName": "AirAsia X"
},
{
  "airlineCode": "Z2",
  "airlineName": "AirAsia Zest"
},
{
  "airlineCode": "V2",
  "airlineName": "Aircompany Karat"
},
{
  "airlineCode": "ED",
  "airlineName": "Airblue"
},
{
  "airlineCode": "4C",
  "airlineName": "Aires SA"
},
{
  "airlineCode": "YQ",
  "airlineName": "Aircompany Polet"
},
{
  "airlineCode": "A5",
  "airlineName": "Airlinair"
},
{
  "airlineCode": "NX",
  "airlineName": "Air Macau"
},
{
  "airlineCode": "CG",
  "airlineName": "Airlines of Papua New Guinea"
},
{
  "airlineCode": "RT",
  "airlineName": "Airlines Of South Australia"
},
{
  "airlineCode": "ND",
  "airlineName": "Airlink"
},
{
  "airlineCode": "FL",
  "airlineName": "Airtran Airways"
},
{
  "airlineCode": "KD",
  "airlineName": "AK Avia OJSC"
},
{
  "airlineCode": "QP",
  "airlineName": "Akasa Air"
},
{
  "airlineCode": "AS",
  "airlineName": "Alaska Airlines"
},
{
  "airlineCode": "6L",
  "airlineName": "Aklak Air"
},
{
  "airlineCode": "J5",
  "airlineName": "Alaska Seaplane"
},
{
  "airlineCode": "LV",
  "airlineName": "Albanian Airlines"
},
{
  "airlineCode": "F4",
  "airlineName": "Albarka Air"
},
{
  "airlineCode": "KO",
  "airlineName": "Alaska Central Express"
},
{
  "airlineCode": "4H",
  "airlineName": "Albatros Airways"
},
{
  "airlineCode": "D4",
  "airlineName": "Alidaunia"
},
{
  "airlineCode": "AZ",
  "airlineName": "Alitalia"
},
{
  "airlineCode": "XM",
  "airlineName": "Alitalia Express"
},
{
  "airlineCode": "NH",
  "airlineName": "All Nippon Airways"
},
{
  "airlineCode": "G4",
  "airlineName": "Allegiant Air"
},
{
  "airlineCode": "MD",
  "airlineName": "Air Madagascar"
},
{
  "airlineCode": "QQ",
  "airlineName": "Alliance Airlines (Australia)"
},
{
  "airlineCode": "CD",
  "airlineName": "Alliance Air (India)"
},
{
  "airlineCode": "AQ",
  "airlineName": "Aloha Airlines"
},
{
  "airlineCode": "3A",
  "airlineName": "Alliance Airlines (Chicago)"
},
{
  "airlineCode": "E8",
  "airlineName": "Alpi Eagles"
},
{
  "airlineCode": "0A",
  "airlineName": "Amber Air"
},
{
  "airlineCode": "HP",
  "airlineName": "America West Airlines"
},
{
  "airlineCode": "AA",
  "airlineName": "American Airlines"
},
{
  "airlineCode": "AX",
  "airlineName": "American Connection"
},
{
  "airlineCode": "MQ",
  "airlineName": "American Eagle Air"
},
{
  "airlineCode": "G6",
  "airlineName": "Angkor Airways"
},
{
  "airlineCode": "O4",
  "airlineName": "Antrak Air"
},
{
  "airlineCode": "7P",
  "airlineName": "APA Intl Air SA"
},
{
  "airlineCode": "5N",
  "airlineName": "Arkhangelsk Airlines"
},
{
  "airlineCode": "FG",
  "airlineName": "Ariana Afghan Airlines"
},
{
  "airlineCode": "5F",
  "airlineName": "Arctic Circle Air"
},
{
  "airlineCode": "W3",
  "airlineName": "Arik Air"
},
{
  "airlineCode": "IZ",
  "airlineName": "Arkia Israeli Airlines"
},
{
  "airlineCode": "U8",
  "airlineName": "Armavia Airline"
},
{
  "airlineCode": "MV",
  "airlineName": "Armenian Intl Airways"
},
{
  "airlineCode": "7S",
  "airlineName": "Artic Transportation Services"
},
{
  "airlineCode": "6K",
  "airlineName": "Asian Spirit"
},
{
  "airlineCode": "R7",
  "airlineName": "Aserca Airlines"
},
{
  "airlineCode": "AG",
  "airlineName": "ARUBA AIRLINES"
},
{
  "airlineCode": "OI",
  "airlineName": "Aspiring Air"
},
{
  "airlineCode": "OZ",
  "airlineName": "Asiana Airlines"
},
{
  "airlineCode": "ZA",
  "airlineName": "Astair"
},
{
  "airlineCode": "5W",
  "airlineName": "Astraeus"
},
{
  "airlineCode": "RC",
  "airlineName": "Atlantic Airways Faroe Islands"
},
{
  "airlineCode": "2B",
  "airlineName": "ATA Aerocondor"
},
{
  "airlineCode": "EV",
  "airlineName": "Atlantic Southeast Airlines"
},
{
  "airlineCode": "TD",
  "airlineName": "Atlantis European Airways"
},
{
  "airlineCode": "8A",
  "airlineName": "Atlas Blue"
},
{
  "airlineCode": "KK",
  "airlineName": "Atlas Jet Intl Airways"
},
{
  "airlineCode": "IP",
  "airlineName": "Atyrau Airways"
},
{
  "airlineCode": "AU",
  "airlineName": "Austral Lineas Aerea"
},
{
  "airlineCode": "IQ",
  "airlineName": "Augsburg Airways"
},
{
  "airlineCode": "GR",
  "airlineName": "Aurigny Air Services"
},
{
  "airlineCode": "OS",
  "airlineName": "Austrian"
},
{
  "airlineCode": "6A",
  "airlineName": "Aviacsa Consorcio Aviaxsa"
},
{
  "airlineCode": "AV",
  "airlineName": "Avianca"
},
{
  "airlineCode": "O6",
  "airlineName": "Avianca Brazil"
},
{
  "airlineCode": "GU",
  "airlineName": "Aviateca"
},
{
  "airlineCode": "WR",
  "airlineName": "Aviaprad"
},
{
  "airlineCode": "U3",
  "airlineName": "Avies"
},
{
  "airlineCode": "M4",
  "airlineName": "AVIOMPEX"
},
{
  "airlineCode": "9V",
  "airlineName": "Avior Airlines"
},
{
  "airlineCode": "C4",
  "airlineName": "Airlines of Carriacou"
},
{
  "airlineCode": "2Q",
  "airlineName": "Avitrans Nordi"
},
{
  "airlineCode": "J2",
  "airlineName": "Azerbaijan Airlines"
},
{
  "airlineCode": "CJ",
  "airlineName": "BA City Flyer"
},
{
  "airlineCode": "PG",
  "airlineName": "Bangkok Airways"
},
{
  "airlineCode": "AD",
  "airlineName": "AZUL LINHAS AEREAS BRASILEIRAS"
},
{
  "airlineCode": "UP",
  "airlineName": "Bahamasair"
},
{
  "airlineCode": "JV",
  "airlineName": "Bearskin Airlines"
},
{
  "airlineCode": "B2",
  "airlineName": "Belavia"
},
{
  "airlineCode": "LZ",
  "airlineName": "Belle Air"
},
{
  "airlineCode": "CH",
  "airlineName": "Bemidji Airlines"
},
{
  "airlineCode": "O3",
  "airlineName": "Bellview Airlines Sierra Leone"
},
{
  "airlineCode": "A8",
  "airlineName": "Benin Golf Air"
},
{
  "airlineCode": "8E",
  "airlineName": "Bering Air"
},
{
  "airlineCode": "J8",
  "airlineName": "Berjaya Air"
},
{
  "airlineCode": "5Z",
  "airlineName": "Bismillah Airlines"
},
{
  "airlineCode": "B3",
  "airlineName": "Bhutan Airlines"
},
{
  "airlineCode": "NT",
  "airlineName": "Binter Canarias"
},
{
  "airlineCode": "BG",
  "airlineName": "Biman Bangladesh"
},
{
  "airlineCode": "4V",
  "airlineName": "Birdy Airlinesce"
},
{
  "airlineCode": "GQ",
  "airlineName": "Big Sky Airlines"
},
{
  "airlineCode": "BV",
  "airlineName": "Blue Panorama Airlines"
},
{
  "airlineCode": "QW",
  "airlineName": "Blue Wings"
},
{
  "airlineCode": "KF",
  "airlineName": "Blue1"
},
{
  "airlineCode": "9I",
  "airlineName": "Alliance Air"
},
{
  "airlineCode": "OB",
  "airlineName": "Boliviana de Aviacion"
},
{
  "airlineCode": "BD",
  "airlineName": "BMI British Midland"
},
{
  "airlineCode": "BU",
  "airlineName": "Braathens AS"
},
{
  "airlineCode": "FQ",
  "airlineName": "Brindabella Airlines"
},
{
  "airlineCode": "DB",
  "airlineName": "Brit Air"
},
{
  "airlineCode": "TH",
  "airlineName": "British Airways Citiexpress"
},
{
  "airlineCode": "BY",
  "airlineName": "Britannia Airways"
},
{
  "airlineCode": "BS",
  "airlineName": "British Intl"
},
{
  "airlineCode": "BA",
  "airlineName": "British Airways"
},
{
  "airlineCode": "SN",
  "airlineName": "Brussels Airlines"
},
{
  "airlineCode": "U4",
  "airlineName": "Buddha Airline"
},
{
  "airlineCode": "FB",
  "airlineName": "Bulgaria Air"
},
{
  "airlineCode": "TV",
  "airlineName": "Brussels Airlines Fly"
},
{
  "airlineCode": "MO",
  "airlineName": "Calm Air Intl"
},
{
  "airlineCode": "R9",
  "airlineName": "Camai Air"
},
{
  "airlineCode": "K6",
  "airlineName": "Cambodia Angkor Air"
},
{
  "airlineCode": "UY",
  "airlineName": "Cameroon Airlines"
},
{
  "airlineCode": "5T",
  "airlineName": "Canadian North"
},
{
  "airlineCode": "C6",
  "airlineName": "Canjet Airlines"
},
{
  "airlineCode": "9K",
  "airlineName": "Cape Air"
},
{
  "airlineCode": "6C",
  "airlineName": "Cape Smythe Air"
},
{
  "airlineCode": "BW",
  "airlineName": "Caribbean Airlines"
},
{
  "airlineCode": "ZQ",
  "airlineName": "Caribbean Sun Air"
},
{
  "airlineCode": "8B",
  "airlineName": "Caribbean Star Airlines"
},
{
  "airlineCode": "RV",
  "airlineName": "Caspian Airlines"
},
{
  "airlineCode": "V3",
  "airlineName": "Carpatair"
},
{
  "airlineCode": "KA",
  "airlineName": "CATHAY DRAGON"
},
{
  "airlineCode": "XP",
  "airlineName": "Casino Express Airlines"
},
{
  "airlineCode": "XK",
  "airlineName": "CCM Airlines"
},
{
  "airlineCode": "CX",
  "airlineName": "Cathay Pacific Airways"
},
{
  "airlineCode": "KX",
  "airlineName": "Cayman Airways"
},
{
  "airlineCode": "9M",
  "airlineName": "Central Mountain Air"
},
{
  "airlineCode": "5J",
  "airlineName": "Cebu Pacific Air"
},
{
  "airlineCode": "C0",
  "airlineName": "Centralwings"
},
{
  "airlineCode": "J7",
  "airlineName": "Centre-Avia Airlines"
},
{
  "airlineCode": "WE",
  "airlineName": "Centurion Cargo Inc"
},
{
  "airlineCode": "M6",
  "airlineName": "Chalair"
},
{
  "airlineCode": "MG",
  "airlineName": "Champion Air"
},
{
  "airlineCode": "RP",
  "airlineName": "Chautauqua Airlines"
},
{
  "airlineCode": "G5",
  "airlineName": "China Express Airlines"
},
{
  "airlineCode": "CI",
  "airlineName": "China Airlines"
},
{
  "airlineCode": "MU",
  "airlineName": "China Eastern Air"
},
{
  "airlineCode": "C8",
  "airlineName": "Chicago Express Airlines"
},
{
  "airlineCode": "CZ",
  "airlineName": "China Southern Airlines"
},
{
  "airlineCode": "QI",
  "airlineName": "Cimber Air"
},
{
  "airlineCode": "CF",
  "airlineName": "City Airline"
},
{
  "airlineCode": "C9",
  "airlineName": "Cirrus Airlines"
},
{
  "airlineCode": "WX",
  "airlineName": "City Jet"
},
{
  "airlineCode": "G2",
  "airlineName": "Avirex Gabon"
},
{
  "airlineCode": "6P",
  "airlineName": "Clubair Sixgo"
},
{
  "airlineCode": "XG",
  "airlineName": "Clickair"
},
{
  "airlineCode": "BX",
  "airlineName": "Coast Air KS"
},
{
  "airlineCode": "CT",
  "airlineName": "Civil Air Transport"
},
{
  "airlineCode": "9L",
  "airlineName": "Colgan Air"
},
{
  "airlineCode": "OH",
  "airlineName": "Comair"
},
{
  "airlineCode": "C5",
  "airlineName": "CommutAir"
},
{
  "airlineCode": "KR",
  "airlineName": "Comores Aviation"
},
{
  "airlineCode": "CP",
  "airlineName": "Compass Airlines"
},
{
  "airlineCode": "CS",
  "airlineName": "Continental Micronesia"
},
{
  "airlineCode": "DE",
  "airlineName": "Condor Flugdienst"
},
{
  "airlineCode": "CO",
  "airlineName": "Continental Airlines"
},
{
  "airlineCode": "V0",
  "airlineName": "Conviasa"
},
{
  "airlineCode": "CM",
  "airlineName": "Copa Airlines"
},
{
  "airlineCode": "F5",
  "airlineName": "Cosmic Air"
},
{
  "airlineCode": "3C",
  "airlineName": "Corporate Express Airlines"
},
{
  "airlineCode": "SS",
  "airlineName": "Corsair Intl"
},
{
  "airlineCode": "DQ",
  "airlineName": "Costal Air Transport"
},
{
  "airlineCode": "CU",
  "airlineName": "Cubana Airlines"
},
{
  "airlineCode": "QE",
  "airlineName": "Crossair Europe"
},
{
  "airlineCode": "N8",
  "airlineName": "CR Airways"
},
{
  "airlineCode": "KJ",
  "airlineName": "BMED"
},
{
  "airlineCode": "OU",
  "airlineName": "Croatia Airlines"
},
{
  "airlineCode": "D3",
  "airlineName": "Daallo Airlines"
},
{
  "airlineCode": "OK",
  "airlineName": "Czech Airlines"
},
{
  "airlineCode": "WD",
  "airlineName": "Dairo Air Services"
},
{
  "airlineCode": "N2",
  "airlineName": "Daghestan Air"
},
{
  "airlineCode": "H8",
  "airlineName": "Dalavia Far East Airways"
},
{
  "airlineCode": "DX",
  "airlineName": "Danish Air Transport"
},
{
  "airlineCode": "0D",
  "airlineName": "Darwin Airlines"
},
{
  "airlineCode": "D5",
  "airlineName": "Dauair"
},
{
  "airlineCode": "JD",
  "airlineName": "Deer Air"
},
{
  "airlineCode": "DI",
  "airlineName": "DBA Luftfahrtgesellschaft"
},
{
  "airlineCode": "3D",
  "airlineName": "Denim Air"
},
{
  "airlineCode": "DL",
  "airlineName": "Delta Air Lines"
},
{
  "airlineCode": "2A",
  "airlineName": "Deutsche Bahn"
},
{
  "airlineCode": "ES",
  "airlineName": "DHL Intl"
},
{
  "airlineCode": "Z6",
  "airlineName": "Dnieproavia State Aviation"
},
{
  "airlineCode": "7D",
  "airlineName": "Donbassaero Airlines"
},
{
  "airlineCode": "D8",
  "airlineName": "Djibouti Airlines"
},
{
  "airlineCode": "E3",
  "airlineName": "Domodedovo Airlines"
},
{
  "airlineCode": "R6",
  "airlineName": "DOT LT"
},
{
  "airlineCode": "Y3",
  "airlineName": "Driessen Services"
},
{
  "airlineCode": "H7",
  "airlineName": "Eagle Aviation Uganda"
},
{
  "airlineCode": "QU",
  "airlineName": "East African Airlines"
},
{
  "airlineCode": "KB",
  "airlineName": "Druk Air"
},
{
  "airlineCode": "B5",
  "airlineName": "East African Safari Air Express"
},
{
  "airlineCode": "3E",
  "airlineName": "East Asia Airlines"
},
{
  "airlineCode": "T3",
  "airlineName": "Eastern Airways"
},
{
  "airlineCode": "8C",
  "airlineName": "East Star Airlines"
},
{
  "airlineCode": "EU",
  "airlineName": "Ecuatoriana"
},
{
  "airlineCode": "U2",
  "airlineName": "Easyjet Airline"
},
{
  "airlineCode": "WK",
  "airlineName": "Edelweiss Air"
},
{
  "airlineCode": "W2",
  "airlineName": "Efata Papua Airlines"
},
{
  "airlineCode": "MS",
  "airlineName": "Egyptair"
},
{
  "airlineCode": "EC",
  "airlineName": "Elysair"
},
{
  "airlineCode": "EK",
  "airlineName": "Emirates Airlines"
},
{
  "airlineCode": "LY",
  "airlineName": "El Al Israel Airlines"
},
{
  "airlineCode": "7H",
  "airlineName": "Era Aviation"
},
{
  "airlineCode": "E0",
  "airlineName": "Eos Airlines"
},
{
  "airlineCode": "ET",
  "airlineName": "Ethiopian Air Lines"
},
{
  "airlineCode": "B8",
  "airlineName": "Eritrean Airlines"
},
{
  "airlineCode": "EY",
  "airlineName": "Etihad Airways"
},
{
  "airlineCode": "5B",
  "airlineName": "Euro- Asia Air Intl"
},
{
  "airlineCode": "YU",
  "airlineName": "Euroatlantic Airways"
},
{
  "airlineCode": "GJ",
  "airlineName": "Eurofly S P A"
},
{
  "airlineCode": "UI",
  "airlineName": "Eurocypria Airlines"
},
{
  "airlineCode": "3W",
  "airlineName": "Euromanx"
},
{
  "airlineCode": "K2",
  "airlineName": "Eurolot SA"
},
{
  "airlineCode": "5O",
  "airlineName": "Europe Airpost"
},
{
  "airlineCode": "QY",
  "airlineName": "EUROPEAN AIR"
},
{
  "airlineCode": "EA",
  "airlineName": "European Air Express"
},
{
  "airlineCode": "RY",
  "airlineName": "European Executive Express"
},
{
  "airlineCode": "EW",
  "airlineName": "Eurowings AG"
},
{
  "airlineCode": "3Z",
  "airlineName": "Everts Air"
},
{
  "airlineCode": "BR",
  "airlineName": "EVA Airways"
},
{
  "airlineCode": "JN",
  "airlineName": "Excel Airways"
},
{
  "airlineCode": "XE",
  "airlineName": "Express Jet Airlines"
},
{
  "airlineCode": "OW",
  "airlineName": "Executive Airlines"
},
{
  "airlineCode": "IH",
  "airlineName": "Falcon Air"
},
{
  "airlineCode": "EF",
  "airlineName": "Far Eastern Air Transport"
},
{
  "airlineCode": "F6",
  "airlineName": "Faroe Jet"
},
{
  "airlineCode": "FC",
  "airlineName": "Finnish Commuter Airlines"
},
{
  "airlineCode": "AY",
  "airlineName": "Finnair"
},
{
  "airlineCode": "DP",
  "airlineName": "First Choice Airways"
},
{
  "airlineCode": "PA",
  "airlineName": "Florida Coastal Airlines"
},
{
  "airlineCode": "FZ",
  "airlineName": "Fly Dubai"
},
{
  "airlineCode": "F7",
  "airlineName": "Flybaboo"
},
{
  "airlineCode": "5H",
  "airlineName": "Fly540"
},
{
  "airlineCode": "7F",
  "airlineName": "First Air"
},
{
  "airlineCode": "BE",
  "airlineName": "Flybe"
},
{
  "airlineCode": "RF",
  "airlineName": "Florida West Intl Airways"
},
{
  "airlineCode": "S9",
  "airlineName": "Flybig"
},
{
  "airlineCode": "SH",
  "airlineName": "FlyMe Sweden"
},
{
  "airlineCode": "E7",
  "airlineName": "Fly European"
},
{
  "airlineCode": "XY",
  "airlineName": "Flynas Airline"
},
{
  "airlineCode": "7Y",
  "airlineName": "Flying Carpet Air Transport"
},
{
  "airlineCode": "X9",
  "airlineName": "City Star Airlines"
},
{
  "airlineCode": "LF",
  "airlineName": "FlyNordic"
},
{
  "airlineCode": "Q5",
  "airlineName": "Forty Mile Air"
},
{
  "airlineCode": "CY",
  "airlineName": "Cyprus Airways"
},
{
  "airlineCode": "F8",
  "airlineName": "Freedom Airlines"
},
{
  "airlineCode": "GY",
  "airlineName": "Gabon Airlines"
},
{
  "airlineCode": "ST",
  "airlineName": "Germania Fluggesellschaft"
},
{
  "airlineCode": "2F",
  "airlineName": "Frontier Flying Service"
},
{
  "airlineCode": "GA",
  "airlineName": "Garuda Indonesian"
},
{
  "airlineCode": "F9",
  "airlineName": "Frontier Airlines"
},
{
  "airlineCode": "G0",
  "airlineName": "Ghana Intl"
},
{
  "airlineCode": "G7",
  "airlineName": "GoJet Airlines"
},
{
  "airlineCode": "QB",
  "airlineName": "Georgian National Airlines"
},
{
  "airlineCode": "A9",
  "airlineName": "Georgian Airways"
},
{
  "airlineCode": "FH",
  "airlineName": "Futura Intl Airways"
},
{
  "airlineCode": "Z5",
  "airlineName": "GMG Airlines"
},
{
  "airlineCode": "4G",
  "airlineName": "Gazpromavia"
},
{
  "airlineCode": "4U",
  "airlineName": "Germanwings"
},
{
  "airlineCode": "GT",
  "airlineName": "GB Airways"
},
{
  "airlineCode": "G3",
  "airlineName": "Gol Transportes Aereos"
},
{
  "airlineCode": "G8",
  "airlineName": "GO FIRST"
},
{
  "airlineCode": "DC",
  "airlineName": "Golden Air Commuter"
},
{
  "airlineCode": "GV",
  "airlineName": "Grant Aviation"
},
{
  "airlineCode": "3M",
  "airlineName": "Gulfstream Intl"
},
{
  "airlineCode": "GF",
  "airlineName": "Gulf Air"
},
{
  "airlineCode": "ZK",
  "airlineName": "Great Lakes Airlines"
},
{
  "airlineCode": "H6",
  "airlineName": "Hageland Aviation Services"
},
{
  "airlineCode": "3R",
  "airlineName": "Gromov Air"
},
{
  "airlineCode": "X3",
  "airlineName": "Hapag-Lloyd Express"
},
{
  "airlineCode": "IJ",
  "airlineName": "GREAT WALL AIRLINES"
},
{
  "airlineCode": "H1",
  "airlineName": "Hahn Air"
},
{
  "airlineCode": "HU",
  "airlineName": "Hainan Airlines"
},
{
  "airlineCode": "4R",
  "airlineName": "Hamburg Intl"
},
{
  "airlineCode": "HR",
  "airlineName": "Hahn Air Businessline"
},
{
  "airlineCode": "H3",
  "airlineName": "Harbour Air (Canada)"
},
{
  "airlineCode": "MT",
  "airlineName": "Great Western Airlines"
},
{
  "airlineCode": "HF",
  "airlineName": "Hapagfly"
},
{
  "airlineCode": "HA",
  "airlineName": "Hawaiian Airlines"
},
{
  "airlineCode": "BH",
  "airlineName": "Hawkair"
},
{
  "airlineCode": "HQ",
  "airlineName": "Harmony Airways"
},
{
  "airlineCode": "HN",
  "airlineName": "Heavylift Cargo Airlines"
},
{
  "airlineCode": "H4",
  "airlineName": "Heli Securite"
},
{
  "airlineCode": "JB",
  "airlineName": "Helijet Intl"
},
{
  "airlineCode": "LE",
  "airlineName": "Helgoland Airlines"
},
{
  "airlineCode": "L5",
  "airlineName": "Helikopter Service"
},
{
  "airlineCode": "DU",
  "airlineName": "Hemus Air"
},
{
  "airlineCode": "YO",
  "airlineName": "Heli-Air Monaco"
},
{
  "airlineCode": "EO",
  "airlineName": "Hewa Bora Airways"
},
{
  "airlineCode": "UD",
  "airlineName": "Hex Air"
},
{
  "airlineCode": "HB",
  "airlineName": "Homer Air"
},
{
  "airlineCode": "HD",
  "airlineName": "Hokkaido Intl Airlines"
},
{
  "airlineCode": "8H",
  "airlineName": "Highland Airways"
},
{
  "airlineCode": "ZU",
  "airlineName": "Helios Airways"
},
{
  "airlineCode": "HX",
  "airlineName": "Hong Kong Airlines"
},
{
  "airlineCode": "2L",
  "airlineName": "Helvetic Airways"
},
{
  "airlineCode": "UO",
  "airlineName": "Hong Kong Express Airways"
},
{
  "airlineCode": "IB",
  "airlineName": "Iberia"
},
{
  "airlineCode": "QX",
  "airlineName": "Horizon Air - Seattle"
},
{
  "airlineCode": "FW",
  "airlineName": "IBEX Airlines"
},
{
  "airlineCode": "C3",
  "airlineName": "ICAR"
},
{
  "airlineCode": "FI",
  "airlineName": "Icelandair"
},
{
  "airlineCode": "X8",
  "airlineName": "Icaro"
},
{
  "airlineCode": "IK",
  "airlineName": "Imair"
},
{
  "airlineCode": "V8",
  "airlineName": "Iliamna Air Taxi"
},
{
  "airlineCode": "DH",
  "airlineName": "Independence AIr"
},
{
  "airlineCode": "7I",
  "airlineName": "Insel Air Intl"
},
{
  "airlineCode": "4O",
  "airlineName": "Interjet"
},
{
  "airlineCode": "3L",
  "airlineName": "Intersky"
},
{
  "airlineCode": "QZ",
  "airlineName": "Indonesia AirAsia"
},
{
  "airlineCode": "ID",
  "airlineName": "Interlink Airlines"
},
{
  "airlineCode": "D6",
  "airlineName": "Interair South Africa"
},
{
  "airlineCode": "6E",
  "airlineName": "IndiGo"
},
{
  "airlineCode": "6I",
  "airlineName": "Intl Business Airlines"
},
{
  "airlineCode": "IR",
  "airlineName": "Iran Air"
},
{
  "airlineCode": "EP",
  "airlineName": "Iran Assemam Airlines"
},
{
  "airlineCode": "IA",
  "airlineName": "Iraqi Airways"
},
{
  "airlineCode": "WP",
  "airlineName": "Island Air"
},
{
  "airlineCode": "FO",
  "airlineName": "Flybondi Airlines"
},
{
  "airlineCode": "IF",
  "airlineName": "Islas Airways"
},
{
  "airlineCode": "HH",
  "airlineName": "Islandsflug HF"
},
{
  "airlineCode": "WC",
  "airlineName": "Islena Airlines"
},
{
  "airlineCode": "6H",
  "airlineName": "Israir"
},
{
  "airlineCode": "9X",
  "airlineName": "Itali Airlines"
},
{
  "airlineCode": "JC",
  "airlineName": "JAL Express"
},
{
  "airlineCode": "I3",
  "airlineName": "Ivoirienne de Transport"
},
{
  "airlineCode": "XV",
  "airlineName": "Ivoire Airways"
},
{
  "airlineCode": "GI",
  "airlineName": "Itek Air"
},
{
  "airlineCode": "JO",
  "airlineName": "JALways"
},
{
  "airlineCode": "LN",
  "airlineName": "Jamahiriya Libyan Arab Airlines"
},
{
  "airlineCode": "3X",
  "airlineName": "JAPAN AIR COMMUTER"
},
{
  "airlineCode": "EG",
  "airlineName": "Japan Asia Airways"
},
{
  "airlineCode": "JL",
  "airlineName": "Japan Airlines Intl"
},
{
  "airlineCode": "NU",
  "airlineName": "Japan Trans Ocean Air"
},
{
  "airlineCode": "J9",
  "airlineName": "Jazeera Airways"
},
{
  "airlineCode": "PP",
  "airlineName": "Jet Aviation Business Jets"
},
{
  "airlineCode": "9W",
  "airlineName": "Jet Airways"
},
{
  "airlineCode": "GK",
  "airlineName": "Jet Smart"
},
{
  "airlineCode": "FP",
  "airlineName": "Freedom Air (Guam)"
},
{
  "airlineCode": "S2",
  "airlineName": "JetLite"
},
{
  "airlineCode": "B6",
  "airlineName": "JetBlue Airways"
},
{
  "airlineCode": "3K",
  "airlineName": "Jetstar Asia Airways"
},
{
  "airlineCode": "JQ",
  "airlineName": "Jetstar Airways"
},
{
  "airlineCode": "J0",
  "airlineName": "Jetlink Express"
},
{
  "airlineCode": "GX",
  "airlineName": "JetX"
},
{
  "airlineCode": "HO",
  "airlineName": "Juneyao Airlines"
},
{
  "airlineCode": "6J",
  "airlineName": "Jubba Airways"
},
{
  "airlineCode": "RQ",
  "airlineName": "Kam Air"
},
{
  "airlineCode": "6S",
  "airlineName": "Kato Airline"
},
{
  "airlineCode": "XC",
  "airlineName": "K D Air"
},
{
  "airlineCode": "3B",
  "airlineName": "Job Air"
},
{
  "airlineCode": "3O",
  "airlineName": "Jubba Airways"
},
{
  "airlineCode": "FK",
  "airlineName": "Keewatin Air"
},
{
  "airlineCode": "KV",
  "airlineName": "Kavminvodyavia"
},
{
  "airlineCode": "M5",
  "airlineName": "Kenmore Air"
},
{
  "airlineCode": "4K",
  "airlineName": "Kenn Borek Air"
},
{
  "airlineCode": "KQ",
  "airlineName": "Kenya Airways"
},
{
  "airlineCode": "BZ",
  "airlineName": "KEYSTONE AIR SERVICE"
},
{
  "airlineCode": "YK",
  "airlineName": "Kibris Turkish"
},
{
  "airlineCode": "IT",
  "airlineName": "Kingfisher"
},
{
  "airlineCode": "_KL",
  "airlineName": "KLM NWA Alliance"
},
{
  "airlineCode": "Y9",
  "airlineName": "Kish Airlines"
},
{
  "airlineCode": "WA",
  "airlineName": "KLM Cityhopper BV"
},
{
  "airlineCode": "KL",
  "airlineName": "KLM Royal Dutch Airlines"
},
{
  "airlineCode": "KP",
  "airlineName": "Kiwi Intl"
},
{
  "airlineCode": "KE",
  "airlineName": "Korean Air"
},
{
  "airlineCode": "K4",
  "airlineName": "Kronflyg"
},
{
  "airlineCode": "MN",
  "airlineName": "Kulula com"
},
{
  "airlineCode": "7B",
  "airlineName": "Krasnoyarsk Airlines"
},
{
  "airlineCode": "KH",
  "airlineName": "Kyrgyz Airways"
},
{
  "airlineCode": "WJ",
  "airlineName": "Labrador Airways"
},
{
  "airlineCode": "R8",
  "airlineName": "Kyrgyzstan Airlines"
},
{
  "airlineCode": "KU",
  "airlineName": "Kuwait Airways"
},
{
  "airlineCode": "QH",
  "airlineName": "Kyrgystan"
},
{
  "airlineCode": "A0",
  "airlineName": "L Avion Elysair"
},
{
  "airlineCode": "JF",
  "airlineName": "L A B Flying Service"
},
{
  "airlineCode": "LR",
  "airlineName": "LACSA"
},
{
  "airlineCode": "N7",
  "airlineName": "Lagun Air"
},
{
  "airlineCode": "7Z",
  "airlineName": "Laker Airways (Bahamas)"
},
{
  "airlineCode": "TM",
  "airlineName": "LAM Lineas Aereas de Mocambique"
},
{
  "airlineCode": "LA",
  "airlineName": "Lan Airlines SA"
},
{
  "airlineCode": "XL",
  "airlineName": "Lan Ecuador Aerolane SA"
},
{
  "airlineCode": "4M",
  "airlineName": "Lan Argentina"
},
{
  "airlineCode": "UC",
  "airlineName": "Lan Chile Cargo"
},
{
  "airlineCode": "LP",
  "airlineName": "Lan Peru SA"
},
{
  "airlineCode": "LU",
  "airlineName": "Lan Express"
},
{
  "airlineCode": "QV",
  "airlineName": "Lao Aviation"
},
{
  "airlineCode": "J6",
  "airlineName": "Larrys Flying Service"
},
{
  "airlineCode": "QL",
  "airlineName": "Laser Airlines"
},
{
  "airlineCode": "8Z",
  "airlineName": "Laser"
},
{
  "airlineCode": "NG",
  "airlineName": "Lauda Air Luftfahrt"
},
{
  "airlineCode": "QJ",
  "airlineName": "Latpass Airlines"
},
{
  "airlineCode": "6Y",
  "airlineName": "Latcharter Airlines"
},
{
  "airlineCode": "HE",
  "airlineName": "LGW"
},
{
  "airlineCode": "L4",
  "airlineName": "Lauda-air SPA"
},
{
  "airlineCode": "LI",
  "airlineName": "Liat"
},
{
  "airlineCode": "ZE",
  "airlineName": "Lineas Aereas Azteca"
},
{
  "airlineCode": "5U",
  "airlineName": "Lineas Aereas Del Estado"
},
{
  "airlineCode": "JT",
  "airlineName": "Lion Airlines"
},
{
  "airlineCode": "TE",
  "airlineName": "Lithuanian Airlines"
},
{
  "airlineCode": "LM",
  "airlineName": "Livingston"
},
{
  "airlineCode": "LO",
  "airlineName": "LOT Polish Airlines"
},
{
  "airlineCode": "8L",
  "airlineName": "Lucky Air"
},
{
  "airlineCode": "L3",
  "airlineName": "LTU Billa Lufttransport"
},
{
  "airlineCode": "CL",
  "airlineName": "Lufthansa CityLine"
},
{
  "airlineCode": "LT",
  "airlineName": "LTU Intl Airways"
},
{
  "airlineCode": "LH",
  "airlineName": "Lufthansa"
},
{
  "airlineCode": "5V",
  "airlineName": "Lviv Airlines"
},
{
  "airlineCode": "LG",
  "airlineName": "Luxair"
},
{
  "airlineCode": "CC",
  "airlineName": "Macair"
},
{
  "airlineCode": "IN",
  "airlineName": "Macedonian Airlines"
},
{
  "airlineCode": "I2",
  "airlineName": "Magenta Air"
},
{
  "airlineCode": "M2",
  "airlineName": "Mahfooz Aviation (Gambia)"
},
{
  "airlineCode": "W5",
  "airlineName": "Mahan Air"
},
{
  "airlineCode": "MH",
  "airlineName": "Malaysia Airline"
},
{
  "airlineCode": "MA",
  "airlineName": "Malev Hungarian Airlines"
},
{
  "airlineCode": "OD",
  "airlineName": "Malindo Air"
},
{
  "airlineCode": "TF",
  "airlineName": "Malmo Aviation"
},
{
  "airlineCode": "R5",
  "airlineName": "Malta Air Charter"
},
{
  "airlineCode": "AE",
  "airlineName": "Mandarin Airlines"
},
{
  "airlineCode": "JE",
  "airlineName": "Mango Air"
},
{
  "airlineCode": "6V",
  "airlineName": "Mars RK"
},
{
  "airlineCode": "MP",
  "airlineName": "Martinair Holland"
},
{
  "airlineCode": "MY",
  "airlineName": "MAXjet Airways"
},
{
  "airlineCode": "M7",
  "airlineName": "Marsland Aviation"
},
{
  "airlineCode": "MW",
  "airlineName": "Maya Island Air"
},
{
  "airlineCode": "IG",
  "airlineName": "Meridiana"
},
{
  "airlineCode": "9H",
  "airlineName": "MDLR"
},
{
  "airlineCode": "MX",
  "airlineName": "Mexicana De Aviacion"
},
{
  "airlineCode": "OM",
  "airlineName": "MIAT - Mongolian Airlines"
},
{
  "airlineCode": "IS",
  "airlineName": "Island Airlines of Nantucket"
},
{
  "airlineCode": "ME",
  "airlineName": "Middle East Airlines"
},
{
  "airlineCode": "YX",
  "airlineName": "Midwest Express Airlines"
},
{
  "airlineCode": "MJ",
  "airlineName": "Mihin Lanka"
},
{
  "airlineCode": "2M",
  "airlineName": "Moldavian Airlines"
},
{
  "airlineCode": "N4",
  "airlineName": "Minerva Airlines"
},
{
  "airlineCode": "FS",
  "airlineName": "Mission Aviation Fellowship"
},
{
  "airlineCode": "ZB",
  "airlineName": "Monarch Airlines"
},
{
  "airlineCode": "UJ",
  "airlineName": "Montair Aviation"
},
{
  "airlineCode": "YM",
  "airlineName": "Montenergo Airlines"
},
{
  "airlineCode": "M9",
  "airlineName": "Motor Sich JSC"
},
{
  "airlineCode": "VZ",
  "airlineName": "My TravelLite"
},
{
  "airlineCode": "8I",
  "airlineName": "MyAir com"
},
{
  "airlineCode": "T2",
  "airlineName": "Nakina Air Service"
},
{
  "airlineCode": "UE",
  "airlineName": "Nasair"
},
{
  "airlineCode": "LS",
  "airlineName": "Jet2com"
},
{
  "airlineCode": "NC",
  "airlineName": "National Jet Systems"
},
{
  "airlineCode": "9O",
  "airlineName": "National Airways Cameroon"
},
{
  "airlineCode": "8M",
  "airlineName": "Myanmar Airways Intl"
},
{
  "airlineCode": "5C",
  "airlineName": "Nature Air"
},
{
  "airlineCode": "EJ",
  "airlineName": "New England Airlines"
},
{
  "airlineCode": "CE",
  "airlineName": "Nationwide Air"
},
{
  "airlineCode": "ZN",
  "airlineName": "Naysa"
},
{
  "airlineCode": "N9",
  "airlineName": "Niger Air Continental"
},
{
  "airlineCode": "WT",
  "airlineName": "Nigeria Airways"
},
{
  "airlineCode": "HG",
  "airlineName": "Niki Luftfahrt"
},
{
  "airlineCode": "XW",
  "airlineName": "NOKSCOOT Airlines"
},
{
  "airlineCode": "JH",
  "airlineName": "Nordeste-Linhas Aereas Regionals"
},
{
  "airlineCode": "6N",
  "airlineName": "Nordic Regional"
},
{
  "airlineCode": "8N",
  "airlineName": "Nordkalottflyg"
},
{
  "airlineCode": "NA",
  "airlineName": "North American Airlines"
},
{
  "airlineCode": "M3",
  "airlineName": "North Flying"
},
{
  "airlineCode": "NW",
  "airlineName": "Northwest Airlines"
},
{
  "airlineCode": "FY",
  "airlineName": "Northwest Regional Airlines"
},
{
  "airlineCode": "2G",
  "airlineName": "Northwest Seaplanes"
},
{
  "airlineCode": "HW",
  "airlineName": "North-Wright Air"
},
{
  "airlineCode": "BJ",
  "airlineName": "Nouvelair Tunisie"
},
{
  "airlineCode": "DY",
  "airlineName": "Norwegian Air Shuttle"
},
{
  "airlineCode": "J3",
  "airlineName": "Northwestern Air"
},
{
  "airlineCode": "VQ",
  "airlineName": "Novo Air"
},
{
  "airlineCode": "N6",
  "airlineName": "Nuevo Continente SA"
},
{
  "airlineCode": "VC",
  "airlineName": "Ocean Airlines SPA"
},
{
  "airlineCode": "O8",
  "airlineName": "Oasis Hong Kong Airlines"
},
{
  "airlineCode": "5K",
  "airlineName": "Odessa Airlines"
},
{
  "airlineCode": "WY",
  "airlineName": "Oman Aviation"
},
{
  "airlineCode": "OC",
  "airlineName": "Omni"
},
{
  "airlineCode": "OL",
  "airlineName": "OLT Ostfriesische Luftransport"
},
{
  "airlineCode": "OA",
  "airlineName": "Olympic Airlines"
},
{
  "airlineCode": "UQ",
  "airlineName": "OConnor-Mt Gambiers Airlines"
},
{
  "airlineCode": "N3",
  "airlineName": "Omskavia Airlines"
},
{
  "airlineCode": "/K",
  "airlineName": "One Ticket to the Worldsd"
},
{
  "airlineCode": "_*O",
  "airlineName": "One world"
},
{
  "airlineCode": "R2",
  "airlineName": "Orenair"
},
{
  "airlineCode": "OX",
  "airlineName": "Orient Thai Airlines"
},
{
  "airlineCode": "ON",
  "airlineName": "Our Airline"
},
{
  "airlineCode": "O7",
  "airlineName": "OzJet Airlines"
},
{
  "airlineCode": "OJ",
  "airlineName": "Overland Airways"
},
{
  "airlineCode": "PV",
  "airlineName": "Pan Air Lineas Aereas SA"
},
{
  "airlineCode": "LW",
  "airlineName": "Pacific Wings"
},
{
  "airlineCode": "Y5",
  "airlineName": "Pace Airlines"
},
{
  "airlineCode": "QO",
  "airlineName": "Origin Pacific Airways"
},
{
  "airlineCode": "7N",
  "airlineName": "Pan Am World Airways Dominicana"
},
{
  "airlineCode": "NR",
  "airlineName": "Pamir Air"
},
{
  "airlineCode": "PK",
  "airlineName": "Pakistan Intl Airlines"
},
{
  "airlineCode": "9P",
  "airlineName": "Palau National Airlines"
},
{
  "airlineCode": "HI",
  "airlineName": "Papillon Airways"
},
{
  "airlineCode": "7E",
  "airlineName": "Panagra Airways"
},
{
  "airlineCode": "BL",
  "airlineName": "Pacific Airlines (Viet Nam)"
},
{
  "airlineCode": "I7",
  "airlineName": "Paramount"
},
{
  "airlineCode": "E9",
  "airlineName": "Pan Am Clipper Connection"
},
{
  "airlineCode": "9J",
  "airlineName": "Pacific Island Aviation"
},
{
  "airlineCode": "3F",
  "airlineName": "Pacific Airways"
},
{
  "airlineCode": "9Q",
  "airlineName": "PB Air"
},
{
  "airlineCode": "PF",
  "airlineName": "Palestinian Airlines"
},
{
  "airlineCode": "8P",
  "airlineName": "Pacific Coastal Airlines"
},
{
  "airlineCode": "GP",
  "airlineName": "Palau Trans Pacific Airlines"
},
{
  "airlineCode": "6D",
  "airlineName": "Pelita Air Service"
},
{
  "airlineCode": "PC",
  "airlineName": "Pegasus"
},
{
  "airlineCode": "KS",
  "airlineName": "Peninsula Airways"
},
{
  "airlineCode": "7V",
  "airlineName": "Pelican Air"
},
{
  "airlineCode": "9E",
  "airlineName": "Pinnacle Airlines"
},
{
  "airlineCode": "4B",
  "airlineName": "Perimeter Aviation"
},
{
  "airlineCode": "PR",
  "airlineName": "Philippine Airlines"
},
{
  "airlineCode": "PQ",
  "airlineName": "Philippines AirAsia"
},
{
  "airlineCode": "9R",
  "airlineName": "Phuket Air"
},
{
  "airlineCode": "P8",
  "airlineName": "PLAS SA"
},
{
  "airlineCode": "PD",
  "airlineName": "Porter Airlines"
},
{
  "airlineCode": "P9",
  "airlineName": "Perm Airlines"
},
{
  "airlineCode": "NI",
  "airlineName": "Portugalia"
},
{
  "airlineCode": "PW",
  "airlineName": "Precisionair"
},
{
  "airlineCode": "PO",
  "airlineName": "Polar Air Cargo"
},
{
  "airlineCode": "PH",
  "airlineName": "Polynesian Airlines"
},
{
  "airlineCode": "PU",
  "airlineName": "Pluna"
},
{
  "airlineCode": "PB",
  "airlineName": "Provincial Airlines"
},
{
  "airlineCode": "Z3",
  "airlineName": "Promech"
},
{
  "airlineCode": "8W",
  "airlineName": "Private Wings"
},
{
  "airlineCode": "FE",
  "airlineName": "Primaris Airlines"
},
{
  "airlineCode": "P0",
  "airlineName": "ProflightCommuter Services"
},
{
  "airlineCode": "XT",
  "airlineName": "PT Indonesia AirAsia Extra"
},
{
  "airlineCode": "YV",
  "airlineName": "Mesa Airlines"
},
{
  "airlineCode": "QR",
  "airlineName": "Qatar Airways"
},
{
  "airlineCode": "QF",
  "airlineName": "Qantas Airways"
},
{
  "airlineCode": "Q0",
  "airlineName": "Quebecair Express"
},
{
  "airlineCode": "EB",
  "airlineName": "Pullmantur Air"
},
{
  "airlineCode": "QG",
  "airlineName": "Qualiflyer Group"
},
{
  "airlineCode": "FN",
  "airlineName": "Regional Air Lines  (Morocco)"
},
{
  "airlineCode": "7R",
  "airlineName": "Red Sea Air"
},
{
  "airlineCode": "RM",
  "airlineName": "Regional Air"
},
{
  "airlineCode": "RX",
  "airlineName": "Regent"
},
{
  "airlineCode": "RW",
  "airlineName": "RAS Fluggesellschaft"
},
{
  "airlineCode": "SL",
  "airlineName": "Rio Sul"
},
{
  "airlineCode": "FV",
  "airlineName": "Rossiya- Russian Airlines"
},
{
  "airlineCode": "RR",
  "airlineName": "Royal Air Force-38 Transport Group"
},
{
  "airlineCode": "YS",
  "airlineName": "Regional CAE"
},
{
  "airlineCode": "QT",
  "airlineName": "Regional Pacific Airlines"
},
{
  "airlineCode": "ZL",
  "airlineName": "Regional Express"
},
{
  "airlineCode": "BI",
  "airlineName": "Royal Brunei Air"
},
{
  "airlineCode": "AT",
  "airlineName": "Royal Air Maroc"
},
{
  "airlineCode": "RK",
  "airlineName": "Royal Khmer Airlines"
},
{
  "airlineCode": "V5",
  "airlineName": "Royal Aruban Airlines"
},
{
  "airlineCode": "RA",
  "airlineName": "Royal Nepal Airlines"
},
{
  "airlineCode": "RJ",
  "airlineName": "Royal Jordanian"
},
{
  "airlineCode": "ZC",
  "airlineName": "Royal Swazi National"
},
{
  "airlineCode": "UB",
  "airlineName": "Myanmar National Airlines"
},
{
  "airlineCode": "WB",
  "airlineName": "Rwandair Express"
},
{
  "airlineCode": "FA",
  "airlineName": "SAFAIR"
},
{
  "airlineCode": "OV",
  "airlineName": "SalamAir"
},
{
  "airlineCode": "4Q",
  "airlineName": "Safi Airways"
},
{
  "airlineCode": "FR",
  "airlineName": "RyanAir (Ireland)"
},
{
  "airlineCode": "HZ",
  "airlineName": "Sakhalinskie Aviatrassy"
},
{
  "airlineCode": "E5",
  "airlineName": "Samara Airlines"
},
{
  "airlineCode": "S3",
  "airlineName": "Santa Barbara Airlines CA"
},
{
  "airlineCode": "ZS",
  "airlineName": "Sama"
},
{
  "airlineCode": "JI",
  "airlineName": "San Juan Aviation"
},
{
  "airlineCode": "S6",
  "airlineName": "Salmon Air"
},
{
  "airlineCode": "9N",
  "airlineName": "SATENA"
},
{
  "airlineCode": "SV",
  "airlineName": "Saudi Arabian Airlines"
},
{
  "airlineCode": "S4",
  "airlineName": "SATA Intl"
},
{
  "airlineCode": "SK",
  "airlineName": "SAS Scandinavian Airlines"
},
{
  "airlineCode": "YR",
  "airlineName": "Scenic Airlines"
},
{
  "airlineCode": "SP",
  "airlineName": "SATA Air Acores"
},
{
  "airlineCode": "TR",
  "airlineName": "Scoot Airlines"
},
{
  "airlineCode": "TZ",
  "airlineName": "Scoot Airlines"
},
{
  "airlineCode": "CB",
  "airlineName": "ScotAirways"
},
{
  "airlineCode": "sdsd",
  "airlineName": "sdsd"
},
{
  "airlineCode": "BB",
  "airlineName": "Seaborne Airlines"
},
{
  "airlineCode": "DN",
  "airlineName": "Senegal Airlines"
},
{
  "airlineCode": "8D",
  "airlineName": "Servant Air"
},
{
  "airlineCode": "5S",
  "airlineName": "Servicios Aereos Profesionales"
},
{
  "airlineCode": "D2",
  "airlineName": "Severstal Aircompany"
},
{
  "airlineCode": "NL",
  "airlineName": "Shaheen Air Intl"
},
{
  "airlineCode": "FM",
  "airlineName": "Shanghai Airlines"
},
{
  "airlineCode": "SC",
  "airlineName": "Shandong Airlines"
},
{
  "airlineCode": "ZH",
  "airlineName": "Shenzhen Airlines"
},
{
  "airlineCode": "S7",
  "airlineName": "Siberia Airlines"
},
{
  "airlineCode": "MI",
  "airlineName": "SilkAir"
},
{
  "airlineCode": "LJ",
  "airlineName": "Sierra National"
},
{
  "airlineCode": "3U",
  "airlineName": "Sichuan Airlines"
},
{
  "airlineCode": "NS",
  "airlineName": "Silk Route Airways"
},
{
  "airlineCode": "FT",
  "airlineName": "Siem Reap Airways Intl"
},
{
  "airlineCode": "N5",
  "airlineName": "Skagway Air Service"
},
{
  "airlineCode": "SQ",
  "airlineName": "Singapore Airlines"
},
{
  "airlineCode": "DD",
  "airlineName": "Sky Asia"
},
{
  "airlineCode": "Y7",
  "airlineName": "Silverjet"
},
{
  "airlineCode": "JW",
  "airlineName": "Skippers Avaition"
},
{
  "airlineCode": "H2",
  "airlineName": "Sky Service"
},
{
  "airlineCode": "_*S",
  "airlineName": "Sky team"
},
{
  "airlineCode": "NE",
  "airlineName": "SkyEurope Airlines"
},
{
  "airlineCode": "5P",
  "airlineName": "SkyEurope Airlines Hungary"
},
{
  "airlineCode": "SI",
  "airlineName": "Skynet Airlines"
},
{
  "airlineCode": "5G",
  "airlineName": "Skyservice Airlines"
},
{
  "airlineCode": "NP",
  "airlineName": "Skytrans"
},
{
  "airlineCode": "K9",
  "airlineName": "Skyward Aviation"
},
{
  "airlineCode": "AL",
  "airlineName": "Skyway Airlines"
},
{
  "airlineCode": "XR",
  "airlineName": "Skywest Airlines (Australia)"
},
{
  "airlineCode": "SX",
  "airlineName": "SkyWork Airlines"
},
{
  "airlineCode": "OO",
  "airlineName": "Skywest Airlines"
},
{
  "airlineCode": "JZ",
  "airlineName": "Skyways AB"
},
{
  "airlineCode": "S0",
  "airlineName": "Slok Air Intl"
},
{
  "airlineCode": "6Q",
  "airlineName": "Slovak Airlines"
},
{
  "airlineCode": "2E",
  "airlineName": "Smokey Bay Air"
},
{
  "airlineCode": "IE",
  "airlineName": "Solomon Airlines"
},
{
  "airlineCode": "QS",
  "airlineName": "Smartwings Travel Service"
},
{
  "airlineCode": "MM",
  "airlineName": "Sociedad Aeronautica Medellin"
},
{
  "airlineCode": "2C",
  "airlineName": "SNCF"
},
{
  "airlineCode": "OY",
  "airlineName": "Soder Airlines"
},
{
  "airlineCode": "4Z",
  "airlineName": "South African Airlink"
},
{
  "airlineCode": "VL",
  "airlineName": "Sonicblue Airways"
},
{
  "airlineCode": "XZ",
  "airlineName": "South African Express"
},
{
  "airlineCode": "SA",
  "airlineName": "South African Airways"
},
{
  "airlineCode": "YB",
  "airlineName": "South African Express"
},
{
  "airlineCode": "YG",
  "airlineName": "South Airlines"
},
{
  "airlineCode": "DG",
  "airlineName": "South East Asian Airlines"
},
{
  "airlineCode": "PL",
  "airlineName": "Southern Air Charter"
},
{
  "airlineCode": "A4",
  "airlineName": "Southern Winds SA"
},
{
  "airlineCode": "JK",
  "airlineName": "Spanair"
},
{
  "airlineCode": "WN",
  "airlineName": "Southwest Airlines"
},
{
  "airlineCode": "SG",
  "airlineName": "SpiceJet"
},
{
  "airlineCode": "NK",
  "airlineName": "Spirit Airlines"
},
{
  "airlineCode": "SJ",
  "airlineName": "Sriwijaya Air"
},
{
  "airlineCode": "S5",
  "airlineName": "Star Air"
},
{
  "airlineCode": "UL",
  "airlineName": "SriLankan Airlines"
},
{
  "airlineCode": "T8",
  "airlineName": "STA Trans African"
},
{
  "airlineCode": "2I",
  "airlineName": "Star Up"
},
{
  "airlineCode": "_*A",
  "airlineName": "Star Alliance"
},
{
  "airlineCode": "SY",
  "airlineName": "Sun Country Airlines"
},
{
  "airlineCode": "8F",
  "airlineName": "STP Airways"
},
{
  "airlineCode": "SD",
  "airlineName": "Sudan Airways"
},
{
  "airlineCode": "DM",
  "airlineName": "Sterling Blue"
},
{
  "airlineCode": "EZ",
  "airlineName": "Sun Air of Scandinavia"
},
{
  "airlineCode": "NB",
  "airlineName": "Sterling"
},
{
  "airlineCode": "2U",
  "airlineName": "Sun dOR Intl Airlines"
},
{
  "airlineCode": "CQ",
  "airlineName": "Sunshine Express Airline"
},
{
  "airlineCode": "9Z",
  "airlineName": "SUPREME AIRLINES"
},
{
  "airlineCode": "XQ",
  "airlineName": "SunExpress"
},
{
  "airlineCode": "HS",
  "airlineName": "Svenska Direktflyg"
},
{
  "airlineCode": "PY",
  "airlineName": "Surinam Airways"
},
{
  "airlineCode": "SM",
  "airlineName": "Swedline"
},
{
  "airlineCode": "Q4",
  "airlineName": "Swazi Express Airways"
},
{
  "airlineCode": "WV",
  "airlineName": "Swe Fly"
},
{
  "airlineCode": "LX",
  "airlineName": "Swiss"
},
{
  "airlineCode": "RB",
  "airlineName": "Syrian Arab Airlines"
},
{
  "airlineCode": "DT",
  "airlineName": "TAAG Angola Airlines"
},
{
  "airlineCode": "TA",
  "airlineName": "Taca Intl Airlines"
},
{
  "airlineCode": "JJ",
  "airlineName": "TAM Linhas Aereas"
},
{
  "airlineCode": "TQ",
  "airlineName": "Tandem Aero"
},
{
  "airlineCode": "7J",
  "airlineName": "Tajikair"
},
{
  "airlineCode": "EQ",
  "airlineName": "TAME C.A. TRANSPORTES AEREOS NACIONALES"
},
{
  "airlineCode": "K3",
  "airlineName": "Taquan Air Service"
},
{
  "airlineCode": "TP",
  "airlineName": "TAP Air Portugal"
},
{
  "airlineCode": "U9",
  "airlineName": "Tatarstan"
},
{
  "airlineCode": "SF",
  "airlineName": "Tassili Airlines"
},
{
  "airlineCode": "RO",
  "airlineName": "Tarom-Romanian Air Transport"
},
{
  "airlineCode": "L6",
  "airlineName": "Tbilaviamsheni"
},
{
  "airlineCode": "RU",
  "airlineName": "TCI Skyking"
},
{
  "airlineCode": "L9",
  "airlineName": "Teamline Air Luftfahrt"
},
{
  "airlineCode": "XJ",
  "airlineName": "Thai AirAsia X"
},
{
  "airlineCode": "TG",
  "airlineName": "Thai Airways Intl"
},
{
  "airlineCode": "ZJ",
  "airlineName": "Teddy Air A/S"
},
{
  "airlineCode": "RI",
  "airlineName": "PT Mandella Airlines"
},
{
  "airlineCode": "FD",
  "airlineName": "Thai AirAsia"
},
{
  "airlineCode": "Q8",
  "airlineName": "Trans Air Congo"
},
{
  "airlineCode": "WI",
  "airlineName": "Tradewinds Airlines"
},
{
  "airlineCode": "9D",
  "airlineName": "Toumai Air Tchad"
},
{
  "airlineCode": "T9",
  "airlineName": "Trans Meridian Airlines"
},
{
  "airlineCode": "UN",
  "airlineName": "Transaero Airlines"
},
{
  "airlineCode": "HV",
  "airlineName": "Transavia Airlines"
},
{
  "airlineCode": "GE",
  "airlineName": "TransAsia Airways"
},
{
  "airlineCode": "VR",
  "airlineName": "Transportes Aereos de Cabo Verde"
},
{
  "airlineCode": "PZ",
  "airlineName": "Transportes Aereso del Mercosur"
},
{
  "airlineCode": "2T",
  "airlineName": "TruJet"
},
{
  "airlineCode": "YC",
  "airlineName": "Trygg-Flygg"
},
{
  "airlineCode": "9T",
  "airlineName": "Travelspan"
},
{
  "airlineCode": "TB",
  "airlineName": "Tui Airlines Belgium"
},
{
  "airlineCode": "TU",
  "airlineName": "Tunis Air"
},
{
  "airlineCode": "OR",
  "airlineName": "Tui Airlines Nederland"
},
{
  "airlineCode": "T5",
  "airlineName": "Turkmenistan Airlines"
},
{
  "airlineCode": "UG",
  "airlineName": "Tuninter"
},
{
  "airlineCode": "TK",
  "airlineName": "Turkish Airlines"
},
{
  "airlineCode": "VO",
  "airlineName": "Tyrolean Airways"
},
{
  "airlineCode": "PS",
  "airlineName": "Ukraine Intl Airline"
},
{
  "airlineCode": "T7",
  "airlineName": "Twin Jet"
},
{
  "airlineCode": "UA",
  "airlineName": "United Airlines"
},
{
  "airlineCode": "B7",
  "airlineName": "Uni Airways"
},
{
  "airlineCode": "3Y",
  "airlineName": "UNIWAYS"
},
{
  "airlineCode": "UF",
  "airlineName": "Ukrainian - Mediterranian Airlines"
},
{
  "airlineCode": "UW",
  "airlineName": "Universal Airlines"
},
{
  "airlineCode": "US",
  "airlineName": "US Airways"
},
{
  "airlineCode": "U6",
  "airlineName": "Ural Airlines"
},
{
  "airlineCode": "U5",
  "airlineName": "USA 3000 Airlines"
},
{
  "airlineCode": "P7",
  "airlineName": "Russian Sky Airlines"
},
{
  "airlineCode": "VA",
  "airlineName": "V Australia"
},
{
  "airlineCode": "VF",
  "airlineName": "Valuair"
},
{
  "airlineCode": "HY",
  "airlineName": "Uzbekistan Airways"
},
{
  "airlineCode": "X4",
  "airlineName": "Vanair"
},
{
  "airlineCode": "RG",
  "airlineName": "Varig"
},
{
  "airlineCode": "VM",
  "airlineName": "Viaggio Air"
},
{
  "airlineCode": "VI",
  "airlineName": "Vieques Air Link"
},
{
  "airlineCode": "VJ",
  "airlineName": "Vietjet Airlines"
},
{
  "airlineCode": "VN",
  "airlineName": "Vietnam Airlines"
},
{
  "airlineCode": "NN",
  "airlineName": "VIM Airlines"
},
{
  "airlineCode": "V6",
  "airlineName": "VIP SA"
},
{
  "airlineCode": "VX",
  "airlineName": "Virgin America"
},
{
  "airlineCode": "VK",
  "airlineName": "Virgin Nigeria Airways"
},
{
  "airlineCode": "VS",
  "airlineName": "Virgin Atlantic"
},
{
  "airlineCode": "UK",
  "airlineName": "Vistara"
},
{
  "airlineCode": "ZG",
  "airlineName": "Viva Macau"
},
{
  "airlineCode": "XF",
  "airlineName": "Vladivostok Air Russian"
},
{
  "airlineCode": "VB",
  "airlineName": "Viva Aero Bus"
},
{
  "airlineCode": "VE",
  "airlineName": "Volare SPA"
},
{
  "airlineCode": "Y4",
  "airlineName": "Volaris Air"
},
{
  "airlineCode": "VG",
  "airlineName": "VLM Airlines"
},
{
  "airlineCode": "4W",
  "airlineName": "Warbelows Air Ventures"
},
{
  "airlineCode": "VY",
  "airlineName": "Vueling Airlines"
},
{
  "airlineCode": "7W",
  "airlineName": "Wayra Peru"
},
{
  "airlineCode": "2W",
  "airlineName": "Welcome Air"
},
{
  "airlineCode": "YH",
  "airlineName": "West Caribbean Air"
},
{
  "airlineCode": "PT",
  "airlineName": "West Air Sweden AB"
},
{
  "airlineCode": "8O",
  "airlineName": "West Coast Air"
},
{
  "airlineCode": "WG",
  "airlineName": "Western Express Airlines"
},
{
  "airlineCode": "WS",
  "airlineName": "WestJet"
},
{
  "airlineCode": "9C",
  "airlineName": "Wimbi Dira Airways"
},
{
  "airlineCode": "WF",
  "airlineName": "Wideroes Flyveselskap"
},
{
  "airlineCode": "CN",
  "airlineName": "Westward Airways"
},
{
  "airlineCode": "K5",
  "airlineName": "Wings of Alaska"
},
{
  "airlineCode": "IW",
  "airlineName": "Wings Air"
},
{
  "airlineCode": "IV",
  "airlineName": "Wind Jet"
},
{
  "airlineCode": "WM",
  "airlineName": "Windward Island Airways"
},
{
  "airlineCode": "W6",
  "airlineName": "Wizz Air Hungary"
},
{
  "airlineCode": "WO",
  "airlineName": "World Airways"
},
{
  "airlineCode": "8V",
  "airlineName": "Wright Air Service"
},
{
  "airlineCode": "WW",
  "airlineName": "Wow Airlines"
},
{
  "airlineCode": "2X",
  "airlineName": "XEROX"
},
{
  "airlineCode": "SE",
  "airlineName": "XL Airways France"
},
{
  "airlineCode": "MF",
  "airlineName": "Xiamen Airlines"
},
{
  "airlineCode": "Y8",
  "airlineName": "Yakutia"
},
{
  "airlineCode": "YL",
  "airlineName": "Yamal Airlines"
},
{
  "airlineCode": "Y0",
  "airlineName": "Yellow Air Taxi"
},
{
  "airlineCode": "HK",
  "airlineName": "Yangon Airways"
},
{
  "airlineCode": "4Y",
  "airlineName": "Yute Air Alaska"
},
{
  "airlineCode": "IY",
  "airlineName": "Yemenia Yemen Airways"
},
{
  "airlineCode": "B4",
  "airlineName": "Zan Air"
},
{
  "airlineCode": "K8",
  "airlineName": "Zambia Skyways"
},
{
  "airlineCode": "Q3",
  "airlineName": "Zambian Airways"
},
{
  "airlineCode": "ZO",
  "airlineName": "Zoom Air"
},
{
  "airlineCode": "Z4",
  "airlineName": "Zoom Airlines"
},
{
  "airlineCode": "7Q",
  "airlineName": "Tibesti AirLibya"
},
{
  "airlineCode": "P2",
  "airlineName": "UTair Aviation JSC"
}];

const seedCarrierSeeder = async () => {
  try {
    // Check if any airlineCode already exist
    const existing = await AirLineCode.find();
    if (existing.length === 0) {
      await AirLineCode.create(carrier);
      console.log('Airline Code seeded successfully.');
    } else {
      // console.log('Carrier table already exists. Skipping seeding.');
    }
  } catch (err) {
    console.error('Error seeding Carrier table:', err);
  }
};

module.exports = { seedCarrierSeeder };

