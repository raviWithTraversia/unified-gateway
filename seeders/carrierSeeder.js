const  AirLineCode = require('../models/AirlineCode');

const carrier = [
    { "value": "3G", "text": "3G-GAMBIA BIRD" },
      { "value": "9F", "text": "9F" },
      { "value": "I8", "text": "Aboriginal Air Services" },
      { "value": "9B", "text": "AccessRail" },
      { "value": "KI", "text": "Adam Air" },
      { "value": "Z7", "text": "ADC Airlines" },
      { "value": "JP", "text": "Adria Airways" },
      { "value": "DF", "text": "Aebal" },
      { "value": "A3", "text": "Aegean Air" },
      { "value": "RE", "text": "Aer Arann Express" },
      { "value": "EI", "text": "Aer Lingus PLC" },
      { "value": "EE", "text": "Aero Airlines" },
      { "value": "E4", "text": "Aero Asia Intl" },
      { "value": "EM", "text": "Aero Benin" },
      { "value": "JR", "text": "Aero California" },
      { "value": "QA", "text": "Aero Caribe" },
      { "value": "P4", "text": "Aero Lineas Sosa" },
      { "value": "HC", "text": "Aero Tropics Air Service" },
      { "value": "DW", "text": "Aero-Charter" },
      { "value": "AJ", "text": "Aerocontractors" },
      { "value": "SU", "text": "Aeroflot Airlines" },
      { "value": "KG", "text": "Aerogaviota" },
      { "value": "AR", "text": "Aerolineas Argentinas" },
      { "value": "2K", "text": "Aerolineas GALAPAGOS" },
      { "value": "5D", "text": "Aerolitoral" },
      { "value": "BQ", "text": "Aeromar Airlines" },
      { "value": "VW", "text": "Aeromar Airlines" },
      { "value": "AM", "text": "Aeromexico" },
      { "value": "OT", "text": "Aeropelican" },
      { "value": "VH", "text": "Aeropostal Alas De Venezuela" },
      { "value": "P5", "text": "AeroRepublica" },
      { "value": "5L", "text": "Aerosur" },
      { "value": "VV", "text": "Aerosvit Airlines" },
      { "value": "AW", "text": "AFRICA WORLD AIRLINES" },
      { "value": "XU", "text": "African Express Airways" },
      { "value": "ML", "text": "African Transport" },
      { "value": "8U", "text": "Afriqiyah Airways" },
      { "value": "X5", "text": "Afrique Airlines" },
      { "value": "ZI", "text": "Aigle Azur" },
      { "value": "AH", "text": "Air Algerie" },
      { "value": "A6", "text": "Air Alps Aviation" },
      { "value": "2Y", "text": "Air Andaman" },
      { "value": "G9", "text": "Air Arabia" },
      { "value": "DJ", "text": "Air Asia Japan" },
      { "value": "4L", "text": "Air Astana" },
      { "value": "KC", "text": "Air Astana" },
      { "value": "UU", "text": "Air Austral" },
      { "value": "W9", "text": "Air Bagan" },
      { "value": "BT", "text": "Air Baltic" },
      { "value": "AB", "text": "Air Berlin" },
      { "value": "BP", "text": "Air Botswana" },
      { "value": "2J", "text": "Air Burkina" },
      { "value": "TY", "text": "Air Caledonie" },
      { "value": "SB", "text": "Air Calin" },
      { "value": "AC", "text": "Air Canada" },
      { "value": "QK", "text": "Air Canada Jazz" },
      { "value": "TX", "text": "Air Caraibes" },
      { "value": "2S", "text": "Air Carnival" },
      { "value": "NV", "text": "Air Central" },
      { "value": "CV", "text": "Air Chatham" },
      { "value": "CA", "text": "Air China" },
      { "value": "4F", "text": "Air City" },
      { "value": "A7", "text": "Air Comet" },
      { "value": "DV", "text": "Air Company SCAT" },
      { "value": "QC", "text": "Air Corridor" },
      { "value": "LB", "text": "Air Costa" },
      { "value": "YN", "text": "Air Creebec" },
      { "value": "EN", "text": "Air Dolomiti S P A" },
      { "value": "UX", "text": "Air Europa" },
      { "value": "PE", "text": "Air Europe SPA" },
      { "value": "OF", "text": "Air Finland" },
      { "value": "AF", "text": "Air France" },
      { "value": "GL", "text": "Air Greenland" },
      { "value": "LQ", "text": "Air Guinea Cargo" },
      { "value": "3S", "text": "Air Guyane" },
      { "value": "NY", "text": "Air Iceland" },
      { "value": "AI", "text": "Air India" },
      { "value": "IX", "text": "Air India Express" },
      { "value": "I5", "text": "Air India Express (I5)" },
      { "value": "IC", "text": "Air India IC" },
      { "value": "3H", "text": "Air Inuit" },
      { "value": "I9", "text": "Air Italy" },
      { "value": "VU", "text": "Air Ivoire" },
      { "value": "JM", "text": "Air Jamaica" },
      { "value": "J4", "text": "Air Jamaica Express" },
      { "value": "NQ", "text": "Air Japan" },
      { "value": "JS", "text": "Air Koryo" },
      { "value": "DR", "text": "Air Link Pty" },
      { "value": "TT", "text": "Air Lithuania" },
      { "value": "L8", "text": "Air Luxor GB" },
      { "value": "C2", "text": "Air Luxor STP" },
      { "value": "NX", "text": "Air Macau" },
      { "value": "MD", "text": "Air Madagascar" },
      { "value": "QM", "text": "Air Malawi" },
      { "value": "KM", "text": "Air Malta" },
      { "value": "6T", "text": "Air Mandalay" },
      { "value": "CW", "text": "Air Marshall Islands" },
      { "value": "MR", "text": "Air Mauritanie" },
      { "value": "MK", "text": "Air Mauritius" },
      { "value": "ZV", "text": "Air Midwest" },
      { "value": "9U", "text": "Air Moldova" },
      { "value": "SW", "text": "Air Namibia" },
      { "value": "NZ", "text": "Air New Zealand" },
      { "value": "EL", "text": "Air Nippon" },
      { "value": "EH", "text": "Air Nippon Network" },
      { "value": "PX", "text": "Air Niugini" },
      { "value": "4N", "text": "Air North" },
      { "value": "TL", "text": "Air North Regional" },
      { "value": "YW", "text": "Air Nostrum" },
      { "value": "6X", "text": "Air Odisha" },
      { "value": "AP", "text": "Air One" },
      { "value": "UT", "text": "Air Orient" },
      { "value": "FJ", "text": "Air Pacific" },
      { "value": "OP", "text": "Air Pegasus" },
      { "value": "GZ", "text": "Air Rarotonga" },
      { "value": "PJ", "text": "Air Saint-Pierre" },
      { "value": "EX", "text": "Air Santo Domingo" },
      { "value": "V7", "text": "Air Senegal" },
      { "value": "JU", "text": "Air Serbia" },
      { "value": "X7", "text": "Air Service" },
      { "value": "HM", "text": "Air Seychelles" },
      { "value": "4D", "text": "Air Sinai" },
      { "value": "GM", "text": "Air Slovakia" },
      { "value": "ZP", "text": "Air St Thomas" },
      { "value": "YI", "text": "Air Sunshine" },
      { "value": "T6", "text": "Air swift" },
      { "value": "VT", "text": "Air Tahiti" },
      { "value": "TN", "text": "Air Tahiti Nui" },
      { "value": "TC", "text": "Air Tanzania" },
      { "value": "8T", "text": "Air Tindi" },
      { "value": "YT", "text": "Air Togo" },
      { "value": "TS", "text": "Air Transat AT" },
      { "value": "JY", "text": "Air Turks Caicos" },
      { "value": "U7", "text": "Air Uganda" },
      { "value": "6U", "text": "Air Ukraine" },
      { "value": "DO", "text": "Air Vallee" },
      { "value": "NF", "text": "Air Vanuatu" },
      { "value": "V1", "text": "Air Ventura" },
      { "value": "6G", "text": "Air Wales" },
      { "value": "ZW", "text": "Air Wisconsin" },
      { "value": "UM", "text": "Air Zimbabwe" },
      { "value": "AK", "text": "AirAsia" },
      { "value": "D7", "text": "AirAsia X" },
      { "value": "Z2", "text": "AirAsia Zest" },
      { "value": "ED", "text": "Airblue" },
      { "value": "V2", "text": "Aircompany Karat" },
      { "value": "YQ", "text": "Aircompany Polet" },
      { "value": "4C", "text": "Aires SA" },
      { "value": "A5", "text": "Airlinair" },
      { "value": "C4", "text": "Airlines of Carriacou" },
      { "value": "CG", "text": "Airlines of Papua New Guinea" },
      { "value": "RT", "text": "Airlines Of South Australia" },
      { "value": "ND", "text": "Airlink" },
      { "value": "FL", "text": "Airtran Airways" },
      { "value": "KD", "text": "AK Avia OJSC" },
      { "value": "QP", "text": "Akasa Air" },
      { "value": "6L", "text": "Aklak Air" },
      { "value": "AS", "text": "Alaska Airlines" },
      { "value": "KO", "text": "Alaska Central Express" },
      { "value": "J5", "text": "Alaska Seaplane" },
      { "value": "LV", "text": "Albanian Airlines" },
      { "value": "F4", "text": "Albarka Air" },
      { "value": "4H", "text": "Albatros Airways" },
      { "value": "D4", "text": "Alidaunia" },
      { "value": "AZ", "text": "Alitalia" },
      { "value": "XM", "text": "Alitalia Express" },
      { "value": "NH", "text": "All Nippon Airways" },
      { "value": "G4", "text": "Allegiant Air" },
      { "value": "9I", "text": "Alliance Air" },
      {
        "Code": "CD",
        "Name": "Alliance Air (India)"
      },
      {
        "Code": "QQ",
        "Name": "Alliance Airlines (Australia)"
      },
      {
        "Code": "3A",
        "Name": "Alliance Airlines (Chicago)"
      },
      {
        "Code": "AQ",
        "Name": "Aloha Airlines"
      },
      {
        "Code": "E8",
        "Name": "Alpi Eagles"
      },
      {
        "Code": "0A",
        "Name": "Amber Air"
      },
      {
        "Code": "HP",
        "Name": "America West Airlines"
      },
      {
        "Code": "AA",
        "Name": "American Airlines"
      },
      {
        "Code": "AX",
        "Name": "American Connection"
      },
      {
        "Code": "MQ",
        "Name": "American Eagle Air"
      },
      {
        "Code": "G6",
        "Name": "Angkor Airways"
      },
      {
        "Code": "O4",
        "Name": "Antrak Air"
      },
      {
        "Code": "7P",
        "Name": "APA Intl Air SA"
      },
      {
        "Code": "5F",
        "Name": "Arctic Circle Air"
      },
      {
        "Code": "FG",
        "Name": "Ariana Afghan Airlines"
      },
      {
        "Code": "W3",
        "Name": "Arik Air"
      },
      {
        "Code": "5N",
        "Name": "Arkhangelsk Airlines"
      },
      {
        "Code": "IZ",
        "Name": "Arkia Israeli Airlines"
      },
      {
        "Code": "U8",
        "Name": "Armavia Airline"
      },
      {
        "Code": "MV",
        "Name": "Armenian Intl Airways"
      },
      {
        "Code": "7S",
        "Name": "Artic Transportation Services"
      },
      {
        "Code": "AG",
        "Name": "ARUBA AIRLINES"
      },
      {
        "Code": "R7",
        "Name": "Aserca Airlines"
      },
      {
        "Code": "6K",
        "Name": "Asian Spirit"
      },
      {
        "Code": "OZ",
        "Name": "Asiana Airlines"
      },
      {
        "Code": "OI",
        "Name": "Aspiring Air"
      },
      {
        "Code": "ZA",
        "Name": "Astair"
      },
      {
        "Code": "5W",
        "Name": "Astraeus"
      },
      {
        "Code": "2B",
        "Name": "ATA Aerocondor"
      },
      {
        "Code": "RC",
        "Name": "Atlantic Airways Faroe Islands"
      },
      {
        "Code": "EV",
        "Name": "Atlantic Southeast Airlines"
      },
      {
        "Code": "TD",
        "Name": "Atlantis European Airways"
      },
      {
        "Code": "8A",
        "Name": "Atlas Blue"
      },
      {
        "Code": "KK",
        "Name": "Atlas Jet Intl Airways"
      },
      {
        "Code": "IP",
        "Name": "Atyrau Airways"
      },
      {
        "Code": "IQ",
        "Name": "Augsburg Airways"
      },
  
];


const seedCarried = async () => {
    try {
      // Check if any product already exist
      const existing = await FareFamilyMaster.find();
      
      if (existing.length === 0) {     
        await FareFamilyMaster.create(fareData); 
        console.log('Carrier table seeded successfully.');     
        
      } else {
        console.log('Carrier table already exists. Skipping seeding.');
      }
    } catch (err) {
      console.error('Error seeding Carrier table:', err);
    }
  };
  
  
  module.exports = {
    seedCarried
  };
  