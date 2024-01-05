const  AirLineCode = require('../models/AirlineCode');

const carrier = [
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
          "airlineCode": "9B",
          "airlineName": "AccessRail"
        },
        {
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
          "airlineCode": "DF",
          "airlineName": "Aebal"
        },
        {
          "airlineCode": "A3",
          "airlineName": "Aegean Air"
        },
        {
          "airlineCode": "RE",
          "airlineName": "Aer Arann Express"
        },
        {
          "airlineCode": "EI",
          "airlineName": "Aer Lingus PLC"
        },
        {
          "airlineCode": "EE",
          "airlineName": "Aero Airlines"
        },
        {
          "airlineCode": "E4",
          "airlineName": "Aero Asia Intl"
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
          "airlineCode": "QA",
          "airlineName": "Aero Caribe"
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
          "airlineCode": "5D",
          "airlineName": "Aerolitoral"
        },
        {
          "airlineCode": "BQ",
          "airlineName": "Aeromar Airlines"
        },
        {
          "airlineCode": "VW",
          "airlineName": "Aeromar Airlines"
        },
        {
          "airlineCode": "AM",
          "airlineName": "Aeromexico"
        },
        {
          "airlineCode": "OT",
          "airlineName": "Aeropelican"
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
          "airlineCode": "4L",
          "airlineName": "Air Astana"
        },
        {
          "airlineCode": "KC",
          "airlineName": "Air Astana"
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
          "airlineCode": "CA",
          "airlineName": "Air China"
        },
        {
          "airlineCode": "4F",
          "airlineName": "Air City"
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
          "airlineCode": "PE",
          "airlineName": "Air Europe SPA"
        },
        {
          "airlineCode": "OF",
          "airlineName": "Air Finland"
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
          "airlineCode": "LQ",
          "airlineName": "Air Guinea Cargo"
        },
        {
          "airlineCode": "3S",
          "airlineName": "Air Guyane"
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
          "airlineCode": "NX",
          "airlineName": "Air Macau"
        },
        {
          "airlineCode": "MD",
          "airlineName": "Air Madagascar"
        },
        {
          "airlineCode": "QM",
          "airlineName": "Air Malawi"
        },
        {
          "airlineCode": "KM",
          "airlineName": "Air Malta"
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
          "airlineCode": "EL",
          "airlineName": "Air Nippon"
        },
        {
          "airlineCode": "EH",
          "airlineName": "Air Nippon Network"
        },
        {
          "airlineCode": "PX",
          "airlineName": "Air Niugini"
        },
        {
          "airlineCode": "4N",
          "airlineName": "Air North"
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
          "airlineCode": "EX",
          "airlineName": "Air Santo Domingo"
        },
        {
          "airlineCode": "V7",
          "airlineName": "Air Senegal"
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
          "airlineCode": "T6",
          "airlineName": "Air swift"
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
          "airlineCode": "TC",
          "airlineName": "Air Tanzania"
        },
        {
          "airlineCode": "8T",
          "airlineName": "Air Tindi"
        },
        {
          "airlineCode": "YT",
          "airlineName": "Air Togo"
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
          "airlineCode": "NF",
          "airlineName": "Air Vanuatu"
        },
        {
          "airlineCode": "V1",
          "airlineName": "Air Ventura"
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
          "airlineCode": "ED",
          "airlineName": "Airblue"
        },
        {
          "airlineCode": "V2",
          "airlineName": "Aircompany Karat"
        },
        {
          "airlineCode": "YQ",
          "airlineName": "Aircompany Polet"
        },
        {
          "airlineCode": "4C",
          "airlineName": "Aires SA"
        },
        {
          "airlineCode": "A5",
          "airlineName": "Airlinair"
        },
        {
          "airlineCode": "C4",
          "airlineName": "Airlines of Carriacou"
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
          "airlineCode": "6L",
          "airlineName": "Aklak Air"
        },
        {
          "airlineCode": "AS",
          "airlineName": "Alaska Airlines"
        },
        {
          "airlineCode": "KO",
          "airlineName": "Alaska Central Express"
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
          "airlineCode": "9I",
          "airlineName": "Alliance Air"
        },
        {
          "airlineCode": "CD",
          "airlineName": "Alliance Air (India)"
        },
        {
          "airlineCode": "QQ",
          "airlineName": "Alliance Airlines (Australia)"
        },
        {
          "airlineCode": "3A",
          "airlineName": "Alliance Airlines (Chicago)"
        },
        {
          "airlineCode": "AQ",
          "airlineName": "Aloha Airlines"
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
          "airlineCode": "5F",
          "airlineName": "Arctic Circle Air"
        },
        {
          "airlineCode": "FG",
          "airlineName": "Ariana Afghan Airlines"
        },
        {
          "airlineCode": "W3",
          "airlineName": "Arik Air"
        },
        {
          "airlineCode": "5N",
          "airlineName": "Arkhangelsk Airlines"
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
          "airlineCode": "AG",
          "airlineName": "ARUBA AIRLINES"
        },
        {
          "airlineCode": "R7",
          "airlineName": "Aserca Airlines"
        },
        {
          "airlineCode": "6K",
          "airlineName": "Asian Spirit"
        },
        {
          "airlineCode": "OZ",
          "airlineName": "Asiana Airlines"
        },
        {
          "airlineCode": "OI",
          "airlineName": "Aspiring Air"
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
          "airlineCode": "2B",
          "airlineName": "ATA Aerocondor"
        },
        {
          "airlineCode": "RC",
          "airlineName": "Atlantic Airways Faroe Islands"
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
          "airlineCode": "IQ",
          "airlineName": "Augsburg Airways"
        },
        {
          "airlineCode": "GR",
          "airlineName": "Aurigny Air Services"
        },
        {
          "airlineCode": "AU",
          "airlineName": "Austral Lineas Aerea"
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
          "airlineCode": "WR",
          "airlineName": "Aviaprad"
        },
        {
          "airlineCode": "GU",
          "airlineName": "Aviateca"
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
          "airlineCode": "G2",
          "airlineName": "Avirex Gabon"
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
          "airlineCode": "AD",
          "airlineName": "AZUL LINHAS AEREAS BRASILEIRAS"
        },
        {
          "airlineCode": "CJ",
          "airlineName": "BA City Flyer"
        },
        {
          "airlineCode": "UP",
          "airlineName": "Bahamasair"
        },
        {
          "airlineCode": "PG",
          "airlineName": "Bangkok Airways"
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
          "airlineCode": "O3",
          "airlineName": "Bellview Airlines Sierra Leone"
        },
        {
          "airlineCode": "CH",
          "airlineName": "Bemidji Airlines"
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
          "airlineCode": "B3",
          "airlineName": "Bhutan Airlines"
        },
        {
          "airlineCode": "GQ",
          "airlineName": "Big Sky Airlines"
        },
        {
          "airlineCode": "BG",
          "airlineName": "Biman Bangladesh"
        },
        {
          "airlineCode": "NT",
          "airlineName": "Binter Canarias"
        },
        {
          "airlineCode": "4V",
          "airlineName": "Birdy Airlinesce"
        },
        {
          "airlineCode": "5Z",
          "airlineName": "Bismillah Airlines"
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
          "airlineCode": "KJ",
          "airlineName": "BMED"
        },
        {
          "airlineCode": "BD",
          "airlineName": "BMI British Midland"
        },
        {
          "airlineCode": "OB",
          "airlineName": "Boliviana de Aviacion"
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
          "airlineCode": "BY",
          "airlineName": "Britannia Airways"
        },
        {
          "airlineCode": "BA",
          "airlineName": "British Airways"
        },
        {
          "airlineCode": "TH",
          "airlineName": "British Airways Citiexpress"
        },
        {
          "airlineCode": "BS",
          "airlineName": "British Intl"
        },
        {
          "airlineCode": "SN",
          "airlineName": "Brussels Airlines"
        },
        {
          "airlineCode": "TV",
          "airlineName": "Brussels Airlines Fly"
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
          "airlineCode": "8B",
          "airlineName": "Caribbean Star Airlines"
        },
        {
          "airlineCode": "ZQ",
          "airlineName": "Caribbean Sun Air"
        },
        {
          "airlineCode": "V3",
          "airlineName": "Carpatair"
        },
        {
          "airlineCode": "XP",
          "airlineName": "Casino Express Airlines"
        },
        {
          "airlineCode": "RV",
          "airlineName": "Caspian Airlines"
        },
        {
          "airlineCode": "KA",
          "airlineName": "CATHAY DRAGON"
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
          "airlineCode": "XK",
          "airlineName": "CCM Airlines"
        },
        {
          "airlineCode": "5J",
          "airlineName": "Cebu Pacific Air"
        },
        {
          "airlineCode": "9M",
          "airlineName": "Central Mountain Air"
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
          "airlineCode": "C8",
          "airlineName": "Chicago Express Airlines"
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
          "airlineCode": "G5",
          "airlineName": "China Express Airlines"
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
          "airlineCode": "C9",
          "airlineName": "Cirrus Airlines"
        },
        {
          "airlineCode": "CF",
          "airlineName": "City Airline"
        },
        {
          "airlineCode": "WX",
          "airlineName": "City Jet"
        },
        {
          "airlineCode": "X9",
          "airlineName": "City Star Airlines"
        },
        {
          "airlineCode": "CT",
          "airlineName": "Civil Air Transport"
        },
        {
          "airlineCode": "XG",
          "airlineName": "Clickair"
        },
        {
          "airlineCode": "6P",
          "airlineName": "Clubair Sixgo"
        },
        {
          "airlineCode": "BX",
          "airlineName": "Coast Air KS"
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
          "airlineCode": "DE",
          "airlineName": "Condor Flugdienst"
        },
        {
          "airlineCode": "CO",
          "airlineName": "Continental Airlines"
        },
        {
          "airlineCode": "CS",
          "airlineName": "Continental Micronesia"
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
          "airlineCode": "3C",
          "airlineName": "Corporate Express Airlines"
        },
        {
          "airlineCode": "SS",
          "airlineName": "Corsair Intl"
        },
        {
          "airlineCode": "F5",
          "airlineName": "Cosmic Air"
        },
        {
          "airlineCode": "DQ",
          "airlineName": "Costal Air Transport"
        },
        {
          "airlineCode": "N8",
          "airlineName": "CR Airways"
        },
        {
          "airlineCode": "OU",
          "airlineName": "Croatia Airlines"
        },
        {
          "airlineCode": "QE",
          "airlineName": "Crossair Europe"
        },
        {
          "airlineCode": "CU",
          "airlineName": "Cubana Airlines"
        },
        {
          "airlineCode": "CY",
          "airlineName": "Cyprus Airways"
        },
        {
          "airlineCode": "OK",
          "airlineName": "Czech Airlines"
        },
        {
          "airlineCode": "D3",
          "airlineName": "Daallo Airlines"
        },
        {
          "airlineCode": "N2",
          "airlineName": "Daghestan Air"
        },
        {
          "airlineCode": "WD",
          "airlineName": "Dairo Air Services"
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
          "airlineCode": "DI",
          "airlineName": "DBA Luftfahrtgesellschaft"
        },
        {
          "airlineCode": "JD",
          "airlineName": "Deer Air"
        },
        {
          "airlineCode": "DL",
          "airlineName": "Delta Air Lines"
        },
        {
          "airlineCode": "3D",
          "airlineName": "Denim Air"
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
          "airlineCode": "D8",
          "airlineName": "Djibouti Airlines"
        },
        {
          "airlineCode": "Z6",
          "airlineName": "Dnieproavia State Aviation"
        },
        {
          "airlineCode": "E3",
          "airlineName": "Domodedovo Airlines"
        },
        {
          "airlineCode": "7D",
          "airlineName": "Donbassaero Airlines"
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
          "airlineCode": "KB",
          "airlineName": "Druk Air"
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
          "airlineCode": "B5",
          "airlineName": "East African Safari Air Express"
        },
        {
          "airlineCode": "3E",
          "airlineName": "East Asia Airlines"
        },
        {
          "airlineCode": "8C",
          "airlineName": "East Star Airlines"
        },
        {
          "airlineCode": "T3",
          "airlineName": "Eastern Airways"
        },
        {
          "airlineCode": "U2",
          "airlineName": "Easyjet Airline"
        },
        {
          "airlineCode": "EU",
          "airlineName": "Ecuatoriana"
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
          "airlineCode": "LY",
          "airlineName": "El Al Israel Airlines"
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
          "airlineCode": "E0",
          "airlineName": "Eos Airlines"
        },
        {
          "airlineCode": "7H",
          "airlineName": "Era Aviation"
        },
        {
          "airlineCode": "B8",
          "airlineName": "Eritrean Airlines"
        },
        {
          "airlineCode": "ET",
          "airlineName": "Ethiopian Air Lines"
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
          "airlineCode": "UI",
          "airlineName": "Eurocypria Airlines"
        },
        {
          "airlineCode": "GJ",
          "airlineName": "Eurofly S P A"
        },
        {
          "airlineCode": "K2",
          "airlineName": "Eurolot SA"
        },
        {
          "airlineCode": "3W",
          "airlineName": "Euromanx"
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
          "airlineCode": "BR",
          "airlineName": "EVA Airways"
        },
        {
          "airlineCode": "3Z",
          "airlineName": "Everts Air"
        },
        {
          "airlineCode": "JN",
          "airlineName": "Excel Airways"
        },
        {
          "airlineCode": "OW",
          "airlineName": "Executive Airlines"
        },
        {
          "airlineCode": "XE",
          "airlineName": "Express Jet Airlines"
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
          "airlineCode": "AY",
          "airlineName": "Finnair"
        },
        {
          "airlineCode": "FC",
          "airlineName": "Finnish Commuter Airlines"
        },
        {
          "airlineCode": "7F",
          "airlineName": "First Air"
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
          "airlineCode": "RF",
          "airlineName": "Florida West Intl Airways"
        },
        {
          "airlineCode": "FZ",
          "airlineName": "Fly Dubai"
        },
        {
          "airlineCode": "E7",
          "airlineName": "Fly European"
        },
        {
          "airlineCode": "5H",
          "airlineName": "Fly540"
        },
        {
          "airlineCode": "F7",
          "airlineName": "Flybaboo"
        },
        {
          "airlineCode": "BE",
          "airlineName": "Flybe"
        },
        {
          "airlineCode": "S9",
          "airlineName": "Flybig"
        },
        {
          "airlineCode": "FO",
          "airlineName": "Flybondi Airlines"
        },
        {
          "airlineCode": "7Y",
          "airlineName": "Flying Carpet Air Transport"
        },
        {
          "airlineCode": "SH",
          "airlineName": "FlyMe Sweden"
        },
        {
          "airlineCode": "XY",
          "airlineName": "Flynas Airline"
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
          "airlineCode": "FP",
          "airlineName": "Freedom Air (Guam)"
        },
        {
          "airlineCode": "F8",
          "airlineName": "Freedom Airlines"
        },
        {
          "airlineCode": "F9",
          "airlineName": "Frontier Airlines"
        },
        {
          "airlineCode": "2F",
          "airlineName": "Frontier Flying Service"
        },
        {
          "airlineCode": "FH",
          "airlineName": "Futura Intl Airways"
        },
        {
          "airlineCode": "GY",
          "airlineName": "Gabon Airlines"
        },
        {
          "airlineCode": "GA",
          "airlineName": "Garuda Indonesian"
        },
        {
          "airlineCode": "4G",
          "airlineName": "Gazpromavia"
        },
        {
          "airlineCode": "GT",
          "airlineName": "GB Airways"
        },
        {
          "airlineCode": "A9",
          "airlineName": "Georgian Airways"
        },
        {
          "airlineCode": "QB",
          "airlineName": "Georgian National Airlines"
        },
        {
          "airlineCode": "ST",
          "airlineName": "Germania Fluggesellschaft"
        },
        {
          "airlineCode": "4U",
          "airlineName": "Germanwings"
        },
        {
          "airlineCode": "G0",
          "airlineName": "Ghana Intl"
        },
        {
          "airlineCode": "Z5",
          "airlineName": "GMG Airlines"
        },
        {
          "airlineCode": "G8",
          "airlineName": "GO FIRST"
        },
        {
          "airlineCode": "G7",
          "airlineName": "GoJet Airlines"
        },
        {
          "airlineCode": "G3",
          "airlineName": "Gol Transportes Aereos"
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
          "airlineCode": "ZK",
          "airlineName": "Great Lakes Airlines"
        },
        {
          "airlineCode": "IJ",
          "airlineName": "GREAT WALL AIRLINES"
        },
        {
          "airlineCode": "MT",
          "airlineName": "Great Western Airlines"
        },
        {
          "airlineCode": "3R",
          "airlineName": "Gromov Air"
        },
        {
          "airlineCode": "GF",
          "airlineName": "Gulf Air"
        },
        {
          "airlineCode": "3M",
          "airlineName": "Gulfstream Intl"
        },
        {
          "airlineCode": "H6",
          "airlineName": "Hageland Aviation Services"
        },
        {
          "airlineCode": "H1",
          "airlineName": "Hahn Air"
        },
        {
          "airlineCode": "HR",
          "airlineName": "Hahn Air Businessline"
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
          "airlineCode": "HF",
          "airlineName": "Hapagfly"
        },
        {
          "airlineCode": "X3",
          "airlineName": "Hapag-Lloyd Express"
        },
        {
          "airlineCode": "H3",
          "airlineName": "Harbour Air (Canada)"
        },
        {
          "airlineCode": "HQ",
          "airlineName": "Harmony Airways"
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
          "airlineCode": "HN",
          "airlineName": "Heavylift Cargo Airlines"
        },
        {
          "airlineCode": "LE",
          "airlineName": "Helgoland Airlines"
        },
        {
          "airlineCode": "H4",
          "airlineName": "Heli Securite"
        },
        {
          "airlineCode": "YO",
          "airlineName": "Heli-Air Monaco"
        },
        {
          "airlineCode": "JB",
          "airlineName": "Helijet Intl"
        },
        {
          "airlineCode": "L5",
          "airlineName": "Helikopter Service"
        },
        {
          "airlineCode": "ZU",
          "airlineName": "Helios Airways"
        },
        {
          "airlineCode": "2L",
          "airlineName": "Helvetic Airways"
        },
        {
          "airlineCode": "DU",
          "airlineName": "Hemus Air"
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
          "airlineCode": "8H",
          "airlineName": "Highland Airways"
        },
        {
          "airlineCode": "HD",
          "airlineName": "Hokkaido Intl Airlines"
        },
        {
          "airlineCode": "HB",
          "airlineName": "Homer Air"
        },
        {
          "airlineCode": "HX",
          "airlineName": "Hong Kong Airlines"
        },
        {
          "airlineCode": "UO",
          "airlineName": "Hong Kong Express Airways"
        },
        {
          "airlineCode": "QX",
          "airlineName": "Horizon Air - Seattle"
        },
        {
          "airlineCode": "IB",
          "airlineName": "Iberia"
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
          "airlineCode": "X8",
          "airlineName": "Icaro"
        },
        {
          "airlineCode": "FI",
          "airlineName": "Icelandair"
        },
        {
          "airlineCode": "V8",
          "airlineName": "Iliamna Air Taxi"
        },
        {
          "airlineCode": "IK",
          "airlineName": "Imair"
        },
        {
          "airlineCode": "DH",
          "airlineName": "Independence AIr"
        },
        {
          "airlineCode": "6E",
          "airlineName": "IndiGo"
        },
        {
          "airlineCode": "QZ",
          "airlineName": "Indonesia AirAsia"
        },
        {
          "airlineCode": "7I",
          "airlineName": "Insel Air Intl"
        },
        {
          "airlineCode": "D6",
          "airlineName": "Interair South Africa"
        },
        {
          "airlineCode": "4O",
          "airlineName": "Interjet"
        },
        {
          "airlineCode": "ID",
          "airlineName": "Interlink Airlines"
        },
        {
          "airlineCode": "3L",
          "airlineName": "Intersky"
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
          "airlineCode": "IS",
          "airlineName": "Island Airlines of Nantucket"
        },
        {
          "airlineCode": "HH",
          "airlineName": "Islandsflug HF"
        },
        {
          "airlineCode": "IF",
          "airlineName": "Islas Airways"
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
          "airlineCode": "GI",
          "airlineName": "Itek Air"
        },
        {
          "airlineCode": "XV",
          "airlineName": "Ivoire Airways"
        },
        {
          "airlineCode": "I3",
          "airlineName": "Ivoirienne de Transport"
        },
        {
          "airlineCode": "JC",
          "airlineName": "JAL Express"
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
          "airlineCode": "JL",
          "airlineName": "Japan Airlines Intl"
        },
        {
          "airlineCode": "EG",
          "airlineName": "Japan Asia Airways"
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
          "airlineCode": "9W",
          "airlineName": "Jet Airways"
        },
        {
          "airlineCode": "PP",
          "airlineName": "Jet Aviation Business Jets"
        },
        {
          "airlineCode": "GK",
          "airlineName": "Jet Smart"
        },
        {
          "airlineCode": "LS",
          "airlineName": "Jet2com"
        },
        {
          "airlineCode": "B6",
          "airlineName": "JetBlue Airways"
        },
        {
          "airlineCode": "J0",
          "airlineName": "Jetlink Express"
        },
        {
          "airlineCode": "S2",
          "airlineName": "JetLite"
        },
        {
          "airlineCode": "JQ",
          "airlineName": "Jetstar Airways"
        },
        {
          "airlineCode": "3K",
          "airlineName": "Jetstar Asia Airways"
        },
        {
          "airlineCode": "GX",
          "airlineName": "JetX"
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
          "airlineCode": "6J",
          "airlineName": "Jubba Airways"
        },
        {
          "airlineCode": "HO",
          "airlineName": "Juneyao Airlines"
        },
        {
          "airlineCode": "XC",
          "airlineName": "K D Air"
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
          "airlineCode": "KV",
          "airlineName": "Kavminvodyavia"
        },
        {
          "airlineCode": "FK",
          "airlineName": "Keewatin Air"
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
          "airlineCode": "Y9",
          "airlineName": "Kish Airlines"
        },
        {
          "airlineCode": "KP",
          "airlineName": "Kiwi Intl"
        },
        {
          "airlineCode": "WA",
          "airlineName": "KLM Cityhopper BV"
        },
        {
          "airlineCode": "_KL",
          "airlineName": "KLM NWA Alliance"
        },
        {
          "airlineCode": "KL",
          "airlineName": "KLM Royal Dutch Airlines"
        },
        {
          "airlineCode": "KE",
          "airlineName": "Korean Air"
        },
        {
          "airlineCode": "7B",
          "airlineName": "Krasnoyarsk Airlines"
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
          "airlineCode": "KU",
          "airlineName": "Kuwait Airways"
        },
        {
          "airlineCode": "QH",
          "airlineName": "Kyrgystan"
        },
        {
          "airlineCode": "KH",
          "airlineName": "Kyrgyz Airways"
        },
        {
          "airlineCode": "R8",
          "airlineName": "Kyrgyzstan Airlines"
        },
        {
          "airlineCode": "JF",
          "airlineName": "L A B Flying Service"
        },
        {
          "airlineCode": "A0",
          "airlineName": "L Avion Elysair"
        },
        {
          "airlineCode": "WJ",
          "airlineName": "Labrador Airways"
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
          "airlineCode": "4M",
          "airlineName": "Lan Argentina"
        },
        {
          "airlineCode": "UC",
          "airlineName": "Lan Chile Cargo"
        },
        {
          "airlineCode": "XL",
          "airlineName": "Lan Ecuador Aerolane SA"
        },
        {
          "airlineCode": "LU",
          "airlineName": "Lan Express"
        },
        {
          "airlineCode": "LP",
          "airlineName": "Lan Peru SA"
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
          "airlineCode": "8Z",
          "airlineName": "Laser"
        },
        {
          "airlineCode": "QL",
          "airlineName": "Laser Airlines"
        },
        {
          "airlineCode": "6Y",
          "airlineName": "Latcharter Airlines"
        },
        {
          "airlineCode": "QJ",
          "airlineName": "Latpass Airlines"
        },
        {
          "airlineCode": "NG",
          "airlineName": "Lauda Air Luftfahrt"
        },
        {
          "airlineCode": "L4",
          "airlineName": "Lauda-air SPA"
        },
        {
          "airlineCode": "HE",
          "airlineName": "LGW"
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
          "airlineCode": "L3",
          "airlineName": "LTU Billa Lufttransport"
        },
        {
          "airlineCode": "LT",
          "airlineName": "LTU Intl Airways"
        },
        {
          "airlineCode": "8L",
          "airlineName": "Lucky Air"
        },
        {
          "airlineCode": "LH",
          "airlineName": "Lufthansa"
        },
        {
          "airlineCode": "CL",
          "airlineName": "Lufthansa CityLine"
        },
        {
          "airlineCode": "LG",
          "airlineName": "Luxair"
        },
        {
          "airlineCode": "5V",
          "airlineName": "Lviv Airlines"
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
          "airlineCode": "W5",
          "airlineName": "Mahan Air"
        },
        {
          "airlineCode": "M2",
          "airlineName": "Mahfooz Aviation (Gambia)"
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
          "airlineCode": "M7",
          "airlineName": "Marsland Aviation"
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
          "airlineCode": "MW",
          "airlineName": "Maya Island Air"
        },
        {
          "airlineCode": "9H",
          "airlineName": "MDLR"
        },
        {
          "airlineCode": "IG",
          "airlineName": "Meridiana"
        },
        {
          "airlineCode": "YV",
          "airlineName": "Mesa Airlines"
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
          "airlineCode": "N4",
          "airlineName": "Minerva Airlines"
        },
        {
          "airlineCode": "FS",
          "airlineName": "Mission Aviation Fellowship"
        },
        {
          "airlineCode": "2M",
          "airlineName": "Moldavian Airlines"
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
          "airlineCode": "8M",
          "airlineName": "Myanmar Airways Intl"
        },
        {
          "airlineCode": "UB",
          "airlineName": "Myanmar National Airlines"
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
          "airlineCode": "9O",
          "airlineName": "National Airways Cameroon"
        },
        {
          "airlineCode": "NC",
          "airlineName": "National Jet Systems"
        },
        {
          "airlineCode": "CE",
          "airlineName": "Nationwide Air"
        },
        {
          "airlineCode": "5C",
          "airlineName": "Nature Air"
        },
        {
          "airlineCode": "ZN",
          "airlineName": "Naysa"
        },
        {
          "airlineCode": "EJ",
          "airlineName": "New England Airlines"
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
          "airlineCode": "J3",
          "airlineName": "Northwestern Air"
        },
        {
          "airlineCode": "HW",
          "airlineName": "North-Wright Air"
        },
        {
          "airlineCode": "DY",
          "airlineName": "Norwegian Air Shuttle"
        },
        {
          "airlineCode": "BJ",
          "airlineName": "Nouvelair Tunisie"
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
          "airlineCode": "O8",
          "airlineName": "Oasis Hong Kong Airlines"
        },
        {
          "airlineCode": "VC",
          "airlineName": "Ocean Airlines SPA"
        },
        {
          "airlineCode": "UQ",
          "airlineName": "OConnor-Mt Gambiers Airlines"
        },
        {
          "airlineCode": "5K",
          "airlineName": "Odessa Airlines"
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
          "airlineCode": "WY",
          "airlineName": "Oman Aviation"
        },
        {
          "airlineCode": "OC",
          "airlineName": "Omni"
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
          "airlineCode": "QO",
          "airlineName": "Origin Pacific Airways"
        },
        {
          "airlineCode": "ON",
          "airlineName": "Our Airline"
        },
        {
          "airlineCode": "OJ",
          "airlineName": "Overland Airways"
        },
        {
          "airlineCode": "O7",
          "airlineName": "OzJet Airlines"
        },
        {
          "airlineCode": "Y5",
          "airlineName": "Pace Airlines"
        },
        {
          "airlineCode": "BL",
          "airlineName": "Pacific Airlines (Viet Nam)"
        },
        {
          "airlineCode": "3F",
          "airlineName": "Pacific Airways"
        },
        {
          "airlineCode": "8P",
          "airlineName": "Pacific Coastal Airlines"
        },
        {
          "airlineCode": "9J",
          "airlineName": "Pacific Island Aviation"
        },
        {
          "airlineCode": "LW",
          "airlineName": "Pacific Wings"
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
          "airlineCode": "GP",
          "airlineName": "Palau Trans Pacific Airlines"
        },
        {
          "airlineCode": "PF",
          "airlineName": "Palestinian Airlines"
        },
        {
          "airlineCode": "NR",
          "airlineName": "Pamir Air"
        },
        {
          "airlineCode": "PV",
          "airlineName": "Pan Air Lineas Aereas SA"
        },
        {
          "airlineCode": "E9",
          "airlineName": "Pan Am Clipper Connection"
        },
        {
          "airlineCode": "7N",
          "airlineName": "Pan Am World Airways Dominicana"
        },
        {
          "airlineCode": "7E",
          "airlineName": "Panagra Airways"
        },
        {
          "airlineCode": "HI",
          "airlineName": "Papillon Airways"
        },
        {
          "airlineCode": "I7",
          "airlineName": "Paramount"
        },
        {
          "airlineCode": "9Q",
          "airlineName": "PB Air"
        },
        {
          "airlineCode": "PC",
          "airlineName": "Pegasus"
        },
        {
          "airlineCode": "7V",
          "airlineName": "Pelican Air"
        },
        {
          "airlineCode": "6D",
          "airlineName": "Pelita Air Service"
        },
        {
          "airlineCode": "KS",
          "airlineName": "Peninsula Airways"
        },
        {
          "airlineCode": "4B",
          "airlineName": "Perimeter Aviation"
        },
        {
          "airlineCode": "P9",
          "airlineName": "Perm Airlines"
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
          "airlineCode": "9E",
          "airlineName": "Pinnacle Airlines"
        },
        {
          "airlineCode": "P8",
          "airlineName": "PLAS SA"
        },
        {
          "airlineCode": "PU",
          "airlineName": "Pluna"
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
          "airlineCode": "PD",
          "airlineName": "Porter Airlines"
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
          "airlineCode": "FE",
          "airlineName": "Primaris Airlines"
        },
        {
          "airlineCode": "8W",
          "airlineName": "Private Wings"
        },
        {
          "airlineCode": "P0",
          "airlineName": "ProflightCommuter Services"
        },
        {
          "airlineCode": "Z3",
          "airlineName": "Promech"
        },
        {
          "airlineCode": "PB",
          "airlineName": "Provincial Airlines"
        },
        {
          "airlineCode": "XT",
          "airlineName": "PT Indonesia AirAsia Extra"
        },
        {
          "airlineCode": "RI",
          "airlineName": "PT Mandella Airlines"
        },
        {
          "airlineCode": "EB",
          "airlineName": "Pullmantur Air"
        },
        {
          "airlineCode": "QF",
          "airlineName": "Qantas Airways"
        },
        {
          "airlineCode": "QR",
          "airlineName": "Qatar Airways"
        },
        {
          "airlineCode": "QG",
          "airlineName": "Qualiflyer Group"
        },
        {
          "airlineCode": "Q0",
          "airlineName": "Quebecair Express"
        },
        {
          "airlineCode": "RW",
          "airlineName": "RAS Fluggesellschaft"
        },
        {
          "airlineCode": "7R",
          "airlineName": "Red Sea Air"
        },
        {
          "airlineCode": "RX",
          "airlineName": "Regent"
        },
        {
          "airlineCode": "RM",
          "airlineName": "Regional Air"
        },
        {
          "airlineCode": "FN",
          "airlineName": "Regional Air Lines  (Morocco)"
        },
        {
          "airlineCode": "YS",
          "airlineName": "Regional CAE"
        },
        {
          "airlineCode": "ZL",
          "airlineName": "Regional Express"
        },
        {
          "airlineCode": "QT",
          "airlineName": "Regional Pacific Airlines"
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
          "airlineCode": "AT",
          "airlineName": "Royal Air Maroc"
        },
        {
          "airlineCode": "V5",
          "airlineName": "Royal Aruban Airlines"
        },
        {
          "airlineCode": "BI",
          "airlineName": "Royal Brunei Air"
        },
        {
          "airlineCode": "RJ",
          "airlineName": "Royal Jordanian"
        },
        {
          "airlineCode": "RK",
          "airlineName": "Royal Khmer Airlines"
        },
        {
          "airlineCode": "RA",
          "airlineName": "Royal Nepal Airlines"
        },
        {
          "airlineCode": "ZC",
          "airlineName": "Royal Swazi National"
        },
        {
          "airlineCode": "P7",
          "airlineName": "Russian Sky Airlines"
        },
        {
          "airlineCode": "WB",
          "airlineName": "Rwandair Express"
        },
        {
          "airlineCode": "FR",
          "airlineName": "RyanAir (Ireland)"
        },
        {
          "airlineCode": "FA",
          "airlineName": "SAFAIR"
        },
        {
          "airlineCode": "4Q",
          "airlineName": "Safi Airways"
        },
        {
          "airlineCode": "HZ",
          "airlineName": "Sakhalinskie Aviatrassy"
        },
        {
          "airlineCode": "OV",
          "airlineName": "SalamAir"
        },
        {
          "airlineCode": "S6",
          "airlineName": "Salmon Air"
        },
        {
          "airlineCode": "ZS",
          "airlineName": "Sama"
        },
        {
          "airlineCode": "E5",
          "airlineName": "Samara Airlines"
        },
        {
          "airlineCode": "JI",
          "airlineName": "San Juan Aviation"
        },
        {
          "airlineCode": "S3",
          "airlineName": "Santa Barbara Airlines CA"
        },
        {
          "airlineCode": "SK",
          "airlineName": "SAS Scandinavian Airlines"
        },
        {
          "airlineCode": "SP",
          "airlineName": "SATA Air Acores"
        },
        {
          "airlineCode": "S4",
          "airlineName": "SATA Intl"
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
          "airlineCode": "YR",
          "airlineName": "Scenic Airlines"
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
          "airlineCode": "SC",
          "airlineName": "Shandong Airlines"
        },
        {
          "airlineCode": "FM",
          "airlineName": "Shanghai Airlines"
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
          "airlineCode": "3U",
          "airlineName": "Sichuan Airlines"
        },
        {
          "airlineCode": "FT",
          "airlineName": "Siem Reap Airways Intl"
        },
        {
          "airlineCode": "LJ",
          "airlineName": "Sierra National"
        },
        {
          "airlineCode": "NS",
          "airlineName": "Silk Route Airways"
        },
        {
          "airlineCode": "MI",
          "airlineName": "SilkAir"
        },
        {
          "airlineCode": "Y7",
          "airlineName": "Silverjet"
        },
        {
          "airlineCode": "SQ",
          "airlineName": "Singapore Airlines"
        },
        {
          "airlineCode": "N5",
          "airlineName": "Skagway Air Service"
        },
        {
          "airlineCode": "JW",
          "airlineName": "Skippers Avaition"
        },
        {
          "airlineCode": "DD",
          "airlineName": "Sky Asia"
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
          "airlineCode": "JZ",
          "airlineName": "Skyways AB"
        },
        {
          "airlineCode": "OO",
          "airlineName": "Skywest Airlines"
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
          "airlineCode": "S0",
          "airlineName": "Slok Air Intl"
        },
        {
          "airlineCode": "6Q",
          "airlineName": "Slovak Airlines"
        },
        {
          "airlineCode": "QS",
          "airlineName": "Smartwings Travel Service"
        },
        {
          "airlineCode": "2E",
          "airlineName": "Smokey Bay Air"
        },
        {
          "airlineCode": "2C",
          "airlineName": "SNCF"
        },
        {
          "airlineCode": "MM",
          "airlineName": "Sociedad Aeronautica Medellin"
        },
        {
          "airlineCode": "OY",
          "airlineName": "Soder Airlines"
        },
        {
          "airlineCode": "IE",
          "airlineName": "Solomon Airlines"
        },
        {
          "airlineCode": "VL",
          "airlineName": "Sonicblue Airways"
        },
        {
          "airlineCode": "4Z",
          "airlineName": "South African Airlink"
        },
        {
          "airlineCode": "SA",
          "airlineName": "South African Airways"
        },
        {
          "airlineCode": "XZ",
          "airlineName": "South African Express"
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
          "airlineCode": "WN",
          "airlineName": "Southwest Airlines"
        },
        {
          "airlineCode": "JK",
          "airlineName": "Spanair"
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
          "airlineCode": "UL",
          "airlineName": "SriLankan Airlines"
        },
        {
          "airlineCode": "SJ",
          "airlineName": "Sriwijaya Air"
        },
        {
          "airlineCode": "T8",
          "airlineName": "STA Trans African"
        },
        {
          "airlineCode": "S5",
          "airlineName": "Star Air"
        },
        {
          "airlineCode": "_*A",
          "airlineName": "Star Alliance"
        },
        {
          "airlineCode": "2I",
          "airlineName": "Star Up"
        },
        {
          "airlineCode": "NB",
          "airlineName": "Sterling"
        },
        {
          "airlineCode": "DM",
          "airlineName": "Sterling Blue"
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
          "airlineCode": "EZ",
          "airlineName": "Sun Air of Scandinavia"
        },
        {
          "airlineCode": "SY",
          "airlineName": "Sun Country Airlines"
        },
        {
          "airlineCode": "2U",
          "airlineName": "Sun dOR Intl Airlines"
        },
        {
          "airlineCode": "XQ",
          "airlineName": "SunExpress"
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
          "airlineCode": "PY",
          "airlineName": "Surinam Airways"
        },
        {
          "airlineCode": "HS",
          "airlineName": "Svenska Direktflyg"
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
          "airlineCode": "SM",
          "airlineName": "Swedline"
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
          "airlineCode": "7J",
          "airlineName": "Tajikair"
        },
        {
          "airlineCode": "JJ",
          "airlineName": "TAM Linhas Aereas"
        },
        {
          "airlineCode": "EQ",
          "airlineName": "TAME C.A. TRANSPORTES AEREOS NACIONALES"
        },
        {
          "airlineCode": "TQ",
          "airlineName": "Tandem Aero"
        },
        {
          "airlineCode": "TP",
          "airlineName": "TAP Air Portugal"
        },
        {
          "airlineCode": "K3",
          "airlineName": "Taquan Air Service"
        },
        {
          "airlineCode": "RO",
          "airlineName": "Tarom-Romanian Air Transport"
        },
        {
          "airlineCode": "SF",
          "airlineName": "Tassili Airlines"
        },
        {
          "airlineCode": "U9",
          "airlineName": "Tatarstan"
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
          "airlineCode": "ZJ",
          "airlineName": "Teddy Air A/S"
        },
        {
          "airlineCode": "FD",
          "airlineName": "Thai AirAsia"
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
          "airlineCode": "7Q",
          "airlineName": "Tibesti AirLibya"
        },
        {
          "airlineCode": "9D",
          "airlineName": "Toumai Air Tchad"
        },
        {
          "airlineCode": "WI",
          "airlineName": "Tradewinds Airlines"
        },
        {
          "airlineCode": "Q8",
          "airlineName": "Trans Air Congo"
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
          "airlineCode": "GE",
          "airlineName": "TransAsia Airways"
        },
        {
          "airlineCode": "HV",
          "airlineName": "Transavia Airlines"
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
          "airlineCode": "9T",
          "airlineName": "Travelspan"
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
          "airlineCode": "TB",
          "airlineName": "Tui Airlines Belgium"
        },
        {
          "airlineCode": "OR",
          "airlineName": "Tui Airlines Nederland"
        },
        {
          "airlineCode": "UG",
          "airlineName": "Tuninter"
        },
        {
          "airlineCode": "TU",
          "airlineName": "Tunis Air"
        },
        {
          "airlineCode": "TK",
          "airlineName": "Turkish Airlines"
        },
        {
          "airlineCode": "T5",
          "airlineName": "Turkmenistan Airlines"
        },
        {
          "airlineCode": "T7",
          "airlineName": "Twin Jet"
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
          "airlineCode": "UF",
          "airlineName": "Ukrainian - Mediterranian Airlines"
        },
        {
          "airlineCode": "B7",
          "airlineName": "Uni Airways"
        },
        {
          "airlineCode": "UA",
          "airlineName": "United Airlines"
        },
        {
          "airlineCode": "UW",
          "airlineName": "Universal Airlines"
        },
        {
          "airlineCode": "3Y",
          "airlineName": "UNIWAYS"
        },
        {
          "airlineCode": "U6",
          "airlineName": "Ural Airlines"
        },
        {
          "airlineCode": "US",
          "airlineName": "US Airways"
        },
        {
          "airlineCode": "U5",
          "airlineName": "USA 3000 Airlines"
        },
        {
          "airlineCode": "P2",
          "airlineName": "UTair Aviation JSC"
        },
        {
          "airlineCode": "HY",
          "airlineName": "Uzbekistan Airways"
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
          "airlineCode": "VS",
          "airlineName": "Virgin Atlantic"
        },
        {
          "airlineCode": "VK",
          "airlineName": "Virgin Nigeria Airways"
        },
        {
          "airlineCode": "UK",
          "airlineName": "Vistara"
        },
        {
          "airlineCode": "VB",
          "airlineName": "Viva Aero Bus"
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
          "airlineCode": "VG",
          "airlineName": "VLM Airlines"
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
          "airlineCode": "VY",
          "airlineName": "Vueling Airlines"
        },
        {
          "airlineCode": "4W",
          "airlineName": "Warbelows Air Ventures"
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
          "airlineCode": "PT",
          "airlineName": "West Air Sweden AB"
        },
        {
          "airlineCode": "YH",
          "airlineName": "West Caribbean Air"
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
          "airlineCode": "CN",
          "airlineName": "Westward Airways"
        },
        {
          "airlineCode": "WF",
          "airlineName": "Wideroes Flyveselskap"
        },
        {
          "airlineCode": "9C",
          "airlineName": "Wimbi Dira Airways"
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
          "airlineCode": "IW",
          "airlineName": "Wings Air"
        },
        {
          "airlineCode": "K5",
          "airlineName": "Wings of Alaska"
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
          "airlineCode": "WW",
          "airlineName": "Wow Airlines"
        },
        {
          "airlineCode": "8V",
          "airlineName": "Wright Air Service"
        },
        {
          "airlineCode": "2X",
          "airlineName": "XEROX"
        },
        {
          "airlineCode": "MF",
          "airlineName": "Xiamen Airlines"
        },
        {
          "airlineCode": "SE",
          "airlineName": "XL Airways France"
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
          "airlineCode": "HK",
          "airlineName": "Yangon Airways"
        },
        {
          "airlineCode": "Y0",
          "airlineName": "Yellow Air Taxi"
        },
        {
          "airlineCode": "IY",
          "airlineName": "Yemenia Yemen Airways"
        },
        {
          "airlineCode": "4Y",
          "airlineName": "Yute Air Alaska"
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
          "airlineCode": "B4",
          "airlineName": "Zan Air"
        },
        {
          "airlineCode": "ZO",
          "airlineName": "Zoom Air"
        },
        {
          "airlineCode": "Z4",
          "airlineName": "Zoom Airlines"
        }
];


const seedCarrierSeeder = async () => {
    try {
      // Check if any airlineCode already exist
      const existing = await AirLineCode.find();
      
      if (existing.length === 0) {     
        await AirLineCode.create(carrier); 
        console.log('Carrier table seeded successfully.');     
        
      } else {
       // console.log('Carrier table already exists. Skipping seeding.');
      }
    } catch (err) {
      console.error('Error seeding Carrier table:', err);
    }
  };
  
  
  module.exports = {seedCarrierSeeder};
  
  