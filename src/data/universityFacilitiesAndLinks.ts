import { FacilityCategory, UniversityExtendedProfile } from '../types/game';

export const FACILITY_CATEGORIES: FacilityCategory[] = [
  'Music & Performing Arts',
  'STEM & Makerspaces',
  'Design & Media Studios',
  'Libraries & 24/7 Hubs',
  'Sports & Wellness',
];

export const UNIVERSITY_EXTENDED_PROFILES: Record<string, UniversityExtendedProfile> = {
  unimelb: {
    universityId: 'unimelb',
    officialPortalUrl: 'https://study.unimelb.edu.au/',
    majorUrls: {
      cs_ai: 'https://study.unimelb.edu.au/find/courses/major/computing-and-software-systems/',
      fintech_ba: 'https://study.unimelb.edu.au/find/courses/undergraduate/bachelor-of-commerce/',
      medicine_health: 'https://study.unimelb.edu.au/find/courses/undergraduate/bachelor-of-biomedicine/',
      architecture_urban: 'https://study.unimelb.edu.au/find/courses/undergraduate/bachelor-of-design/',
      psychology_social: 'https://study.unimelb.edu.au/find/courses/major/psychology/',
      biotech_env: 'https://study.unimelb.edu.au/find/courses/undergraduate/bachelor-of-science/',
    },
    dormSources: [
      {
        label: 'UniMelb Official Accommodation Portal',
        url: 'https://study.unimelb.edu.au/your-experience/accommodation',
        category: 'dorm',
        note: 'University-managed apartments & Little Hall / Lisa Bellear House',
      },
      {
        label: 'Residential Colleges Network (10 Colleges)',
        url: 'https://www.colleges.unimelb.edu.au/',
        category: 'dorm',
        note: 'Ormond, Trinity, Queen’s, Newman & St Hilda’s catered colleges',
      },
      {
        label: 'Scape Melbourne Student Living',
        url: 'https://www.scape.com/en-au/student-accommodation/melbourne',
        category: 'partner',
        note: 'Off-campus studios near Parkville & Swanston St',
      },
    ],
    facilitiesSummary:
      'Historic Parkville sandstone quadrangles paired with the modern Arts West, Melbourne Connect innovation precinct, and Southbank Conservatorium.',
    musicHighlight:
      'Ian Potter Southbank Centre & Parkville student union practice rooms (bookable acoustic upright & grand piano rooms, ensemble booths, and recording studio access via UMSU & Breadth music).',
    dormMusicAndLounges:
      'Residential Colleges (Trinity, Ormond, Little Hall) feature private basement music practice rooms with pianos, formal dining halls, and 24/7 tutorial rooms.',
    nonMajorMusicAccess: true,
    facilitiesUrl: 'https://students.unimelb.edu.au/student-life/campuses-and-facilities',
    musicUrl:
      'https://students.unimelb.edu.au/student-life/campuses-and-facilities/research,-study-and-activity-spaces/practice-rooms',
    spaces: [
      {
        category: 'Music & Performing Arts',
        name: 'Parkville Practice Rooms & Ian Potter Southbank',
        details:
          'Sound-isolated solo piano booths, band rehearsal spaces, digital audio workstations, and 400-seat Hanson Dyer recital hall.',
        accessNote: 'Student Union practice rooms bookable by all students; Southbank suites for Conservatorium & Breadth.',
      },
      {
        category: 'STEM & Makerspaces',
        name: 'Melbourne Connect & Telstra Creator Space',
        details:
          'Prototyping bays, 3D printers, CNC routers, electronics soldering benches, and GPU compute clusters.',
        accessNote: 'Open to Engineering, IT & enrolled Design/Science students after safety induction.',
      },
      {
        category: 'Design & Media Studios',
        name: 'MSD (Melbourne School of Design) FabLab',
        details:
          'Laser cutters, robotics timber arms, model-making workshops, and daylight architecture critique studios.',
        accessNote: 'Extended 24/7 swipe access during studio review weeks.',
      },
      {
        category: 'Libraries & 24/7 Hubs',
        name: 'Baillieu Library & Rowden White Lounge',
        details:
          'Rare collections vault, quiet reading halls, VR media labs, and 24-hour student study pods during exam blocks.',
        accessNote: 'Student ID card access across 6 specialist branch libraries.',
      },
      {
        category: 'Sports & Wellness',
        name: 'Beaumont & Nona Lee Sports Centre',
        details:
          '25m heated indoor lap pool, competition athletics track, squash courts, and multi-floor strength gym.',
        accessNote: 'Subsidized student memberships; 40+ varsity sports clubs.',
      },
    ],
  },

  usyd: {
    universityId: 'usyd',
    officialPortalUrl: 'https://www.sydney.edu.au/courses/undergraduate.html',
    majorUrls: {
      medicine_health: 'https://www.sydney.edu.au/courses/courses/uc/bachelor-of-science-and-doctor-of-medicine.html',
      law_ir: 'https://www.sydney.edu.au/courses/courses/uc/bachelor-of-arts-and-bachelor-of-laws.html',
      fintech_ba: 'https://www.sydney.edu.au/courses/courses/uc/bachelor-of-commerce.html',
      cs_ai: 'https://www.sydney.edu.au/courses/courses/uc/bachelor-of-advanced-computing.html',
      architecture_urban: 'https://www.sydney.edu.au/courses/courses/uc/bachelor-of-design-in-architecture.html',
      psychology_social: 'https://www.sydney.edu.au/courses/courses/uc/bachelor-of-psychology-honours.html',
    },
    dormSources: [
      {
        label: 'USYD Official Student Accommodation',
        url: 'https://www.sydney.edu.au/study/accommodation.html',
        category: 'dorm',
        note: 'Queen Mary Building, Regiment, Abercrombie & Darlington House',
      },
      {
        label: 'Sydney University Residential Colleges',
        url: 'https://www.sydney.edu.au/study/accommodation/residential-colleges.html',
        category: 'dorm',
        note: 'St Paul’s, St John’s, Wesley, Sancta Sophia & Women’s College',
      },
      {
        label: 'UniLodge & Iglu Broadway Sydney',
        url: 'https://www.unilodge.com.au/student-accommodation-sydney',
        category: 'partner',
        note: 'Purpose-built apartments 5 mins from Camperdown campus',
      },
    ],
    facilitiesSummary:
      'Camperdown’s iconic Gothic Quadrangle blends with the Abercrombie Business School, Sydney Nanoscience Hub, and Circular Quay Conservatorium.',
    musicHighlight:
      'Sydney Conservatorium of Music (Macquarie St) houses 70+ acoustic practice rooms, Verbrugghen Hall, and recording suites; USU Camperdown rooms also offer bookable upright pianos & band gear.',
    dormMusicAndLounges:
      'Queen Mary Building includes rooftop cinemas and communal sound-treated music rooms; historic Colleges host chapel choirs, organs, and grand pianos.',
    nonMajorMusicAccess: true,
    facilitiesUrl: 'https://www.sydney.edu.au/about-us/campuses/facilities.html',
    musicUrl: 'https://sydney-con.libcal.com/',
    spaces: [
      {
        category: 'Music & Performing Arts',
        name: 'Conservatorium Practice Suites & USU Band Rooms',
        details:
          'Steinway and Yamaha grand practice studios, drum/band rehearsal rooms, and Seymour Centre black-box theatres.',
        accessNote: 'USU rooms open to all members; Conservatorium booths reserved for music & elective students.',
      },
      {
        category: 'STEM & Makerspaces',
        name: 'Sydney Nanoscience Hub & Engineering Precinct',
        details:
          'Cleanroom wafer labs, robotics assembly floors, wind tunnels, and autonomous vehicle test bays.',
        accessNote: 'Faculty-supervised lab access across Engineering & Science courses.',
      },
      {
        category: 'Design & Media Studios',
        name: 'Wilkinson Architecture Studios & DMAF Lab',
        details:
          'Digital fabrication workshops, robotic clay/timber arms, and green-screen video production rooms.',
        accessNote: 'Open 7 days for Architecture, Design & Media cohorts.',
      },
      {
        category: 'Libraries & 24/7 Hubs',
        name: 'Fisher Library & Carslaw Learning Hub',
        details:
          '9-floor flagship research library with 24/7 After-Hours Hub, silent reading rooms, and group media booths.',
        accessNote: '24/7 swipe access with student campus card.',
      },
      {
        category: 'Sports & Wellness',
        name: 'Sydney Uni Sport & Aquatic Centre (SUSAC)',
        details:
          '50m Olympic indoor pool, climbing & bouldering wall, boxing ring, and Oval No. 1 grandstand.',
        accessNote: 'Student-discounted passes & intramural college sports leagues.',
      },
    ],
  },

  unsw: {
    universityId: 'unsw',
    officialPortalUrl: 'https://www.unsw.edu.au/study',
    majorUrls: {
      cs_ai: 'https://www.unsw.edu.au/study/undergraduate/bachelor-of-science-computer-science',
      mechatronics: 'https://www.unsw.edu.au/study/undergraduate/bachelor-of-engineering-honours-mechatronic',
      fintech_ba: 'https://www.unsw.edu.au/study/undergraduate/bachelor-of-commerce',
      architecture_urban: 'https://www.unsw.edu.au/study/undergraduate/bachelor-of-architectural-studies',
      ux_graphic_design: 'https://www.unsw.edu.au/study/undergraduate/bachelor-of-design',
      law_ir: 'https://www.unsw.edu.au/study/undergraduate/bachelor-of-politics-philosophy-and-economics',
    },
    dormSources: [
      {
        label: 'UNSW Accommodation & Colleges Portal',
        url: 'https://www.unsw.edu.au/accommodation',
        category: 'dorm',
        note: 'Kensington Colleges, Colombo House, Fig Tree Hall & Terraces',
      },
      {
        label: 'UNSW Village On-Campus Apartments',
        url: 'https://www.unswvillage.com.au/',
        category: 'dorm',
        note: 'Self-catered shared & studio apartments directly inside Kensington',
      },
      {
        label: 'Urbanest / Scape Kensington Housing',
        url: 'https://www.scape.com/en-au/student-accommodation/sydney',
        category: 'partner',
        note: 'Verified off-campus rooms along Anzac Parade light rail',
      },
    ],
    facilitiesSummary:
      'Kensington engineering powerhouse featuring the Hilmer Innovation Building, Roundhouse live-music venue, and Paddington Art & Design studios.',
    musicHighlight:
      'UNSW Music Practice Rooms (Robert Webster Building) + Arc Music Club rooms and The Roundhouse live concert stage with professional PA & mixing rigs.',
    dormMusicAndLounges:
      'Kensington Colleges & Colombo House offer common-room pianos, acoustically baffled jam rooms, and shared rooftop study terraces.',
    nonMajorMusicAccess: true,
    facilitiesUrl: 'https://www.unsw.edu.au/about-us/our-campuses',
    musicUrl:
      'https://www.unsw.edu.au/arts-design-architecture/our-schools/sam/student-resources/music-resources',
    spaces: [
      {
        category: 'Music & Performing Arts',
        name: 'Robert Webster Music Labs & Roundhouse',
        details:
          'Digital synthesis workstations, upright piano studios, choral rehearsal hall, and 2,200-capacity live music venue.',
        accessNote: 'Open booking for Arts/Music students plus Arc student music club sessions.',
      },
      {
        category: 'STEM & Makerspaces',
        name: 'MCIC Michael Crouch Innovation Centre',
        details:
          '2,000 sqm flagship makerspace with laser cutters, metal lathes, PCB fabrication, and Sunswift solar car garage.',
        accessNote: 'Free access for all UNSW students after badge completion.',
      },
      {
        category: 'Design & Media Studios',
        name: 'UNSW Paddington Art & Design Makerspace',
        details:
          '3D animation farms, motion-capture stage, textile & ceramic kilns, and cinema screening rooms.',
        accessNote: 'Shuttle bus links Kensington directly to Paddington studios.',
      },
      {
        category: 'Libraries & 24/7 Hubs',
        name: 'Main Library & Law Library 24/7 Zones',
        details:
          '10-level Main Library overlooking Sydney skyline with silent pods and round-the-clock exam season floors.',
        accessNote: '24-hour card access on lower learning commons.',
      },
      {
        category: 'Sports & Wellness',
        name: 'UNSW Fitness & Aquatic Centre',
        details:
          '50m 8-lane indoor Olympic pool, multi-sport courts, squash rooms, and Village Green turf fields.',
        accessNote: '10 mins from Coogee Beach; student memberships available.',
      },
    ],
  },

  anu: {
    universityId: 'anu',
    officialPortalUrl: 'https://programsandcourses.anu.edu.au/',
    majorUrls: {
      law_ir: 'https://programsandcourses.anu.edu.au/program/bir',
      cs_ai: 'https://programsandcourses.anu.edu.au/program/bacom',
      biotech_env: 'https://programsandcourses.anu.edu.au/program/bsbio',
      fintech_ba: 'https://programsandcourses.anu.edu.au/program/bcom',
      languages_translation: 'https://programsandcourses.anu.edu.au/program/ba',
    },
    dormSources: [
      {
        label: 'ANU Accommodation Guarantee Portal',
        url: 'https://study.anu.edu.au/accommodation',
        category: 'dorm',
        note: 'Bruce Hall, Wright Hall, Fenner Hall, Burgmann & Ursula Hall',
      },
      {
        label: 'ANU UniLodge Residences (Acton)',
        url: 'https://www.unilodge.com.au/student-accommodation-canberra',
        category: 'dorm',
        note: 'Warrumbul, Lena Karmel, Kinloch & Davey Lodges on campus edge',
      },
      {
        label: 'Study Canberra Student Living Guide',
        url: 'https://www.studycanberra.com.au/live/accommodation',
        category: 'partner',
        note: 'Independent Canberra housing cost & transport guide',
      },
    ],
    facilitiesSummary:
      'Parkland campus in central Canberra featuring National Computational Infrastructure (NCI) supercomputers, Kambri cultural precinct, and School of Music.',
    musicHighlight:
      'ANU School of Music & Llewellyn Hall offers 35+ acoustic practice rooms, Steinway concert hall, and professional multitrack recording studios.',
    dormMusicAndLounges:
      'Almost every ANU Hall (Bruce, Wright, Burton & Garran, Burgmann) has dedicated soundproofed band & piano rooms for residents 24/7.',
    nonMajorMusicAccess: true,
    facilitiesUrl: 'https://www.anu.edu.au/about/campuses-facilities',
    musicUrl: 'https://music.cass.anu.edu.au/services/room-bookings',
    spaces: [
      {
        category: 'Music & Performing Arts',
        name: 'ANU School of Music & Llewellyn Hall',
        details:
          '1,400-seat concert hall, professional ProTools recording studio, percussion bays, and dozens of upright/grand piano studios.',
        accessNote: 'Open access via Music courses, ANU ensembles, or dorm music suites.',
      },
      {
        category: 'STEM & Makerspaces',
        name: 'Birch Makerspace & NCI Gadi Supercomputer',
        details:
          'Home to Australia’s fastest research supercomputer plus open-access robotics, laser cutting, and electronics labs.',
        accessNote: 'Undergraduate research & Computing students receive cluster quotas.',
      },
      {
        category: 'Design & Media Studios',
        name: 'Kambri Cinema & School of Art Workshops',
        details:
          'Digital film editing labs, printmaking, glassblowing, and Kambri Amphitheatre performance lawn.',
        accessNote: 'Available through Arts electives and student clubs.',
      },
      {
        category: 'Libraries & 24/7 Hubs',
        name: 'Chifley, Hancock & Menzies Libraries',
        details:
          '24/7 Chifley Library study commons, Asia-Pacific rare archive in Menzies, and quiet forest-view desks.',
        accessNote: '24/7 student ID access across Chifley & Hancock.',
      },
      {
        category: 'Sports & Wellness',
        name: 'ANU Sport & Lake Burley Griffin Boatshed',
        details:
          '25m pool, climbing tower, tennis & AFL ovals, plus rowing shells directly on Lake Burley Griffin.',
        accessNote: 'Walking distance from all on-campus dormitories.',
      },
    ],
  },

  monash: {
    universityId: 'monash',
    officialPortalUrl: 'https://www.monash.edu/study/courses',
    majorUrls: {
      medicine_health: 'https://www.monash.edu/study/courses/find-a-course/biomedical-science-m2003',
      biotech_env: 'https://www.monash.edu/study/courses/find-a-course/science-s2000',
      cs_ai: 'https://www.monash.edu/study/courses/find-a-course/computer-science-c2001',
      fintech_ba: 'https://www.monash.edu/study/courses/find-a-course/commerce-b2001',
      education_edtech: 'https://www.monash.edu/study/courses/find-a-course/education-honours-d3001',
      logistics_scm: 'https://www.monash.edu/study/courses/find-a-course/business-b2000',
    },
    dormSources: [
      {
        label: 'Monash Residential Services (On-Campus)',
        url: 'https://www.monash.edu/accommodation',
        category: 'dorm',
        note: 'Urban Community studios (Logan, Campbell, Turner) & traditional Halls',
      },
      {
        label: 'Mannix College at Monash Clayton',
        url: 'https://mannix.monash.edu/',
        category: 'dorm',
        note: 'Catered academic residential college across from campus',
      },
      {
        label: 'Scape & Student Housing Australia (Clayton)',
        url: 'https://www.studenthousingaustralia.com.au/',
        category: 'partner',
        note: 'Off-campus shared & studio housing around Clayton & Caulfield',
      },
    ],
    facilitiesSummary:
      'Self-contained Clayton innovation city featuring the Ian Potter Performing Arts Centre, Monash Maker Space, and Australian Synchrotron neighbour.',
    musicHighlight:
      'Sir Zelman Cowen School of Music & Sound at Clayton features the 560-seat Sound Gallery, jazz labs, Gamelan studio, and 25+ acoustic & digital practice rooms.',
    dormMusicAndLounges:
      'Monash Residential Halls (Richardson, Roberts, Campbell) provide basement jam rooms, grand pianos in shared lounges, and rooftop BBQ kitchens.',
    nonMajorMusicAccess: true,
    facilitiesUrl: 'https://www.monash.edu/about/our-locations/clayton-campus',
    musicUrl: 'https://www.monash.edu/arts/music-performance',
    spaces: [
      {
        category: 'Music & Performing Arts',
        name: 'Ian Potter Centre for Performing Arts & Sound Gallery',
        details:
          'Variable-acoustics Sound Gallery, 240-seat Jazz Club, orchestral rehearsal room, and bookable solo piano practice pods.',
        accessNote: 'Practice suites open to music majors, electives & Monash student ensemble members.',
      },
      {
        category: 'STEM & Makerspaces',
        name: 'Woodside Building & Monash Makerspace',
        details:
          'Motorsport Formula SAE workshop, robotics arena, green-building smart microgrid, and 3D metal printers.',
        accessNote: '24/7 engineering team workshops and drop-in student maker bays.',
      },
      {
        category: 'Design & Media Studios',
        name: 'MADA (Art, Design & Architecture) Caulfield',
        details:
          'Industrial design workshops, VR immersion cave, fine arts print rooms, and film post-production suites.',
        accessNote: 'Free inter-campus express shuttle links Clayton and Caulfield.',
      },
      {
        category: 'Libraries & 24/7 Hubs',
        name: 'Matheson, Hargrave-Andrew & Law Libraries',
        details:
          '24/7 learning commons in Hargrave-Andrew Science/IT library plus quiet research wings in Matheson.',
        accessNote: 'Extended overnight access year-round.',
      },
      {
        category: 'Sports & Wellness',
        name: 'Monash Sport & Doug Ellis Swimming Pool',
        details:
          '25m indoor pool, full basketball & badminton stadium, squash courts, and FIFA-grade soccer pitch.',
        accessNote: 'Directly adjacent to Residential Village studios.',
      },
    ],
  },

  uq: {
    universityId: 'uq',
    officialPortalUrl: 'https://study.uq.edu.au/',
    majorUrls: {
      biotech_env: 'https://study.uq.edu.au/study-options/programs/bachelor-biotechnology-2459',
      medicine_health: 'https://study.uq.edu.au/study-options/programs/bachelor-biomedical-science-2462',
      mechatronics: 'https://study.uq.edu.au/study-options/programs/bachelor-engineering-honours-2455',
      hospitality_tourism: 'https://study.uq.edu.au/study-options/programs/bachelor-tourism-hospitality-and-event-management-2394',
      psychology_social: 'https://study.uq.edu.au/study-options/programs/bachelor-psychological-science-honours-2379',
      cs_ai: 'https://study.uq.edu.au/study-options/programs/bachelor-computer-science-2451',
    },
    dormSources: [
      {
        label: 'UQ Accommodation & UQ Res Portal',
        url: 'https://my.uq.edu.au/student-support/accommodation',
        category: 'dorm',
        note: 'Kev Carmody House on campus & verified housing guarantee program',
      },
      {
        label: 'UQ St Lucia Residential Colleges (10 Colleges)',
        url: 'https://my.uq.edu.au/student-support/accommodation/uq-residential-colleges',
        category: 'dorm',
        note: 'Emmanuel, Cromwell, King’s, Grace, St Leo’s & Union College',
      },
      {
        label: 'Student One & UniLodge Brisbane',
        url: 'https://studentone.com/',
        category: 'partner',
        note: 'Riverfront & CBD student apartments connected by CityCat ferry',
      },
    ],
    facilitiesSummary:
      'Riverside St Lucia campus ringed by jacarandas, featuring UQ Innovate makerspaces, Schonell Theatre, and Olympic-standard aquatic & athletics hubs.',
    musicHighlight:
      'UQ School of Music (Zelman Cowen Building) & Nickson Room offer 20+ sound-isolated piano/instrumental booths and digital audio recording suites; Colleges also keep music rooms.',
    dormMusicAndLounges:
      'St Lucia Colleges (King’s, Emmanuel, St John’s) and Kev Carmody House feature dedicated practice piano rooms, amphitheatres, and sunlit riverside lawns.',
    nonMajorMusicAccess: true,
    facilitiesUrl: 'https://campuses.uq.edu.au/st-lucia',
    musicUrl: 'https://music.uq.edu.au/about/facilities',
    spaces: [
      {
        category: 'Music & Performing Arts',
        name: 'UQ School of Music & Nickson Recital Room',
        details:
          'Bookable acoustic practice studios, Steinway recital hall, choir rooms, and UQ Union Schonell Cinema & Theatre.',
        accessNote: 'Practice booths open to Music students & UQ ensemble/club musicians.',
      },
      {
        category: 'STEM & Makerspaces',
        name: 'UQ Innovate & Andrew N. Liveris Building',
        details:
          'Massive student prototyping hall with laser cutters, waterjet machines, robotics labs, and biotech fermentation units.',
        accessNote: 'Free inductive access for Engineering, Science & IT students.',
      },
      {
        category: 'Design & Media Studios',
        name: 'Zelman Cowen Architecture & Journalism Studios',
        details:
          'Broadcast TV/radio production desk, architectural woodshops, and VR visualization pods.',
        accessNote: 'Available during coursework & studio hours.',
      },
      {
        category: 'Libraries & 24/7 Hubs',
        name: 'Duhig Tower & Dorothy Hill Engineering Library',
        details:
          '6 branches across St Lucia with 24/7 Social & Collaborative zones and silent research levels.',
        accessNote: 'Overnight access via UQ student ID card.',
      },
      {
        category: 'Sports & Wellness',
        name: 'UQ Sport Aquatic, Tennis & Athletics Centre',
        details:
          '50m heated Olympic pool, 21 competition tennis courts, synthetic athletics stadium, and river kayaking.',
        accessNote: 'Year-round outdoor sun + discounted student passes.',
      },
    ],
  },

  uwa: {
    universityId: 'uwa',
    officialPortalUrl: 'https://www.uwa.edu.au/study',
    majorUrls: {
      mechatronics: 'https://www.uwa.edu.au/study/courses/bachelor-of-engineering-honours',
      biotech_env: 'https://www.uwa.edu.au/study/courses/bachelor-of-science',
      cs_ai: 'https://www.uwa.edu.au/study/courses/computer-science',
      fintech_ba: 'https://www.uwa.edu.au/study/courses/bachelor-of-commerce',
      psychology_social: 'https://www.uwa.edu.au/study/courses/psychology',
    },
    dormSources: [
      {
        label: 'UWA Residential Colleges (College Row)',
        url: 'https://www.uwa.edu.au/study/student-life/accommodation',
        category: 'dorm',
        note: 'University Hall, Trinity, St George’s, St Catherine’s & Currie Hall',
      },
      {
        label: 'University Hall UWA',
        url: 'https://unihall.uwa.edu.au/',
        category: 'dorm',
        note: 'UWA-owned catered & self-catered studios right across Winthrop Ave',
      },
      {
        label: 'Campus Perth & Switch Living',
        url: 'https://www.campusperth.com/',
        category: 'partner',
        note: 'Modern city student co-living 12 mins from Crawley campus',
      },
    ],
    facilitiesSummary:
      'Swan River Mediterranean campus featuring EZONE UWA engineering hub, Conservatorium of Music, and walkable College Row residences.',
    musicHighlight:
      'UWA Conservatorium of Music houses the Eileen Joyce Studio (historic keyboard & Steinway collection), Callaway Auditorium, and student practice rooms.',
    dormMusicAndLounges:
      'St George’s and Trinity Colleges are famed across Perth for in-house Steinway concert rooms, student orchestras, and acoustic practice pods.',
    nonMajorMusicAccess: true,
    facilitiesUrl: 'https://www.uwa.edu.au/about/campus-and-facilities',
    musicUrl: 'https://www.uwa.edu.au/schools/music',
    spaces: [
      {
        category: 'Music & Performing Arts',
        name: 'Conservatorium of Music & Winthrop Hall',
        details:
          '28 soundproof practice studios, Eileen Joyce historical keyboard collection, and Octagon & Dolphin Theatres.',
        accessNote: 'Conservatorium booths open to Music students & UWA Music Society members.',
      },
      {
        category: 'STEM & Makerspaces',
        name: 'EZONE UWA Engineering & Data Science Hub',
        details:
          'AUD 80M building with robotics innovation labs, motorsport assembly bays, and Shell/industry project studios.',
        accessNote: 'Student keycard access for STEM cohorts and Makers clubs.',
      },
      {
        category: 'Design & Media Studios',
        name: 'ALVA (Architecture & Visual Arts) Workshops',
        details:
          'Timber, metal, and digital fabrication studios overlooking the Matilda Bay foreshore.',
        accessNote: 'Open 7 days for Design & Architecture majors.',
      },
      {
        category: 'Libraries & 24/7 Hubs',
        name: 'Reid Library & Barry J Marshall Science Library',
        details:
          'Reid Library 24-hour zone, collaborative booths, and riverside balconies.',
        accessNote: 'Swipe access round the clock.',
      },
      {
        category: 'Sports & Wellness',
        name: 'UWA Aquatic Centre & Matilda Bay Sailing',
        details:
          'Heated outdoor Olympic pool, state-of-the-art gym, squash courts, and campus sailing/rowing launch.',
        accessNote: 'Minutes from campus dormitories and riverfront.',
      },
    ],
  },

  uts: {
    universityId: 'uts',
    officialPortalUrl: 'https://www.uts.edu.au/study',
    majorUrls: {
      cs_ai: 'https://www.uts.edu.au/study/find-a-course/bachelor-of-computing-science-honours',
      ux_graphic_design: 'https://www.uts.edu.au/study/find-a-course/bachelor-design-visual-communication',
      mechatronics: 'https://www.uts.edu.au/study/find-a-course/bachelor-engineering-honours-mechatronic-engineering',
      marketing_media: 'https://www.uts.edu.au/study/find-a-course/bachelor-communication-media-business',
      fintech_ba: 'https://www.uts.edu.au/study/find-a-course/bachelor-business',
      logistics_scm: 'https://www.uts.edu.au/study/find-a-course/bachelor-management',
    },
    dormSources: [
      {
        label: 'UTS Housing Service (Yura Mudang)',
        url: 'https://www.uts.edu.au/current-students/support/uts-housing-service',
        category: 'dorm',
        note: 'High-rise Yura Mudang apartments directly on Broadway',
      },
      {
        label: 'Scape Sydney Central & Quay',
        url: 'https://www.scape.com/en-au/student-accommodation/sydney',
        category: 'partner',
        note: 'Purpose-built apartments next door to UTS Building 11',
      },
      {
        label: 'Iglu Broadway & Central',
        url: 'https://iglu.com.au/sydney/',
        category: 'partner',
        note: 'Modern studio & multi-share housing steps from Central Station',
      },
    ],
    facilitiesSummary:
      'Vertical, futuristic city campus near Central Station including the Frank Gehry Chau Chak Wing building, Data Arena, and Robotics Tech Lab.',
    musicHighlight:
      'ActivateUTS Sound & Rehearsal Spaces plus UTS Music & Media production studios offer drum kits, amps, keyboard rooms, and podcast/audio mixing desks.',
    dormMusicAndLounges:
      'Yura Mudang rooftop sky-lounges feature communal acoustic music nooks, pool tables, study terraces, and panoramic Sydney CBD views.',
    nonMajorMusicAccess: true,
    facilitiesUrl: 'https://www.uts.edu.au/about/campus-and-facilities',
    musicUrl: 'https://www.activateuts.com.au/',
    spaces: [
      {
        category: 'Music & Performing Arts',
        name: 'ActivateUTS Music Rehearsal & Sound Studios',
        details:
          'Equipped band rehearsal room (drums, amps, PA), DJ decks, acoustic practice pods, and underground student bar stage.',
        accessNote: 'Bookable online by all UTS students via ActivateUTS clubs & music access.',
      },
      {
        category: 'STEM & Makerspaces',
        name: 'UTS Data Arena & Tech Lab (Botany)',
        details:
          '360-degree 3D stereoscopic data-visualization cylinder, autonomous robotics hall, and 3D-printing Prototyping Lab.',
        accessNote: 'Accessible across Engineering, IT & Data Science subjects.',
      },
      {
        category: 'Design & Media Studios',
        name: 'UTS DAB Fabrication & Animation Studios',
        details:
          '24-hour animation labs, green-screen broadcast newsroom, architectural laser workshops, and UX usability suites.',
        accessNote: 'DAB swipe access for Design, Architecture & Communication cohorts.',
      },
      {
        category: 'Libraries & 24/7 Hubs',
        name: 'UTS Central Reading Room & Retrieval System',
        details:
          'Iconic 3-storey glass reading spiral in UTS Central with automated underground book robotics.',
        accessNote: 'Extended study commons open 24/7 before exams.',
      },
      {
        category: 'Sports & Wellness',
        name: 'ActivateFit Gym & Ross Milbourne Sports Hall',
        details:
          'Underground multi-sport stadium beneath Alumni Green, Olympic lifting racks, and dance/martial-arts studios.',
        accessNote: 'Located centrally inside Ultimo campus.',
      },
    ],
  },

  rmit_melb: {
    universityId: 'rmit_melb',
    officialPortalUrl: 'https://www.rmit.edu.au/study-with-us',
    majorUrls: {
      ux_graphic_design: 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-design-digital-media-bp309',
      architecture_urban: 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-architectural-design-bp250',
      marketing_media: 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-communication-advertising-bp219',
      logistics_scm: 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-business-bp343',
      cs_ai: 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-computer-science-bp094',
      hospitality_tourism: 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-tourism-hospitality-and-events-bp293',
    },
    dormSources: [
      {
        label: 'RMIT Accommodation Support Hub',
        url: 'https://www.rmit.edu.au/students/support-services/accommodation',
        category: 'dorm',
        note: 'Verified CBD student apartments & homestay network',
      },
      {
        label: 'Scape & UniLodge Melbourne Central',
        url: 'https://www.unilodge.com.au/student-accommodation-melbourne',
        category: 'partner',
        note: 'Towers directly beside RMIT Building 8 & State Library',
      },
      {
        label: 'Iglu Melbourne City',
        url: 'https://iglu.com.au/melbourne/',
        category: 'partner',
        note: 'Queen Victoria Market student studios 3 mins from campus',
      },
    ],
    facilitiesSummary:
      'Open urban campus threaded along Melbourne’s Swanston Street featuring award-winning Design Hub, Sound Design suites, and Swanston Academic Building.',
    musicHighlight:
      'RMIT Sound Design & Music Production Suites (Building 9) offer Dolby Atmos mixing rooms, synth labs, Foley studios, plus RUSU jam rooms for all students.',
    dormMusicAndLounges:
      'Surrounding CBD student towers (Scape, UniLodge, Iglu) feature cinema lounges, rooftop terraces, and sound-isolated karaoke/jam pods.',
    nonMajorMusicAccess: true,
    facilitiesUrl: 'https://www.rmit.edu.au/about/our-locations-and-facilities',
    musicUrl: 'https://www.rmit.edu.au/about/our-locations-and-facilities/facilities/media-and-production',
    spaces: [
      {
        category: 'Music & Performing Arts',
        name: 'Building 9 Audio Suites & Kaleide Theatre',
        details:
          'Dolby 5.1/Atmos mixing desks, electronic music modular synth lab, acoustic vocal booths, and 260-seat theatre.',
        accessNote: 'Production suites for Sound/Media majors; RUSU student jam rooms open to all.',
      },
      {
        category: 'STEM & Makerspaces',
        name: 'Advanced Manufacturing Precinct & VXLab',
        details:
          'Additive titanium/polymer 3D printers, virtual/augmented reality cave, and autonomous drone test hall.',
        accessNote: 'Available for Engineering, IT & Creative Tech projects.',
      },
      {
        category: 'Design & Media Studios',
        name: 'RMIT Design Hub & Media Precinct',
        details:
          'Green-screen cyclorama film studios, fashion pattern workshops, darkrooms, and world-famous studio critique decks.',
        accessNote: 'Core studios accessible 7 days across creative programs.',
      },
      {
        category: 'Libraries & 24/7 Hubs',
        name: 'Swanston Library & State Library Victoria (Next Door)',
        details:
          'Collaborative digital workstations steps away from the iconic La Trobe Reading Room.',
        accessNote: '24/7 student study lounges in Building 12 & 80.',
      },
      {
        category: 'Sports & Wellness',
        name: 'RMIT City Fitness & Bundoora Sports Complex',
        details:
          'CBD basketball/futsal multi-courts at Bowen St plus FIFA fields & athletics facilities at Bundoora.',
        accessNote: 'Free/subsidized student recreation sessions daily.',
      },
    ],
  },

  macquarie: {
    universityId: 'macquarie',
    officialPortalUrl: 'https://www.mq.edu.au/study',
    majorUrls: {
      fintech_ba: 'https://www.mq.edu.au/study/find-a-course/courses/bachelor-of-commerce',
      psychology_social: 'https://www.mq.edu.au/study/find-a-course/courses/bachelor-of-psychology',
      marketing_media: 'https://www.mq.edu.au/study/find-a-course/courses/bachelor-of-media-and-communications',
      cs_ai: 'https://www.mq.edu.au/study/find-a-course/courses/bachelor-of-information-technology',
      languages_translation: 'https://www.mq.edu.au/study/find-a-course/courses/bachelor-of-arts',
      logistics_scm: 'https://www.mq.edu.au/study/find-a-course/courses/bachelor-of-business-analytics',
    },
    dormSources: [
      {
        label: 'Macquarie Central Courtyard Accommodation',
        url: 'https://www.mq.edu.au/study/why-study-here/student-life/accommodation',
        category: 'dorm',
        note: 'Brand-new on-campus Central Courtyard dorms above student dining',
      },
      {
        label: 'Dunmore Lang & Robert Menzies Colleges',
        url: 'https://www.dunmorelangcollege.nsw.edu.au/',
        category: 'dorm',
        note: 'Traditional catered residential colleges on Macquarie campus edge',
      },
      {
        label: 'Macquarie University Village',
        url: 'https://www.mqvillage.com.au/',
        category: 'partner',
        note: 'Townhouse-style student community beside Macquarie Park Metro',
      },
    ],
    facilitiesSummary:
      '126-hectare park-like tech campus inside Macquarie Park with its own Metro station, Private Hospital, and Central Courtyard hub.',
    musicHighlight:
      'Macquarie Music & Media Precinct (Arts Building 25B) houses acoustic rehearsal rooms, Steinway studios, and professional audio recording suites open via electives & Music Society.',
    dormMusicAndLounges:
      'Central Courtyard Residence and Dunmore Lang College feature dedicated soundproof music practice booths, rooftop kitchens, and sunlit courtyard lounges.',
    nonMajorMusicAccess: true,
    facilitiesUrl: 'https://www.mq.edu.au/about/campus-and-facilities',
    musicUrl: 'https://www.mq.edu.au/faculty-of-arts/departments-and-schools/school-of-communication-society-and-culture',
    spaces: [
      {
        category: 'Music & Performing Arts',
        name: 'Arts Music Studios & Lighthouse Theatre',
        details:
          'Live recording rooms, ProTools post-production suites, digital keyboard labs, and campus performance venue.',
        accessNote: 'Open to Music/Media students and student band society bookings.',
      },
      {
        category: 'STEM & Makerspaces',
        name: 'Cyber Security Hub & Optus-MQ Innovation Lab',
        details:
          'Simulated Cyber Range defense lab, robotics workshop, and Macquarie University Teaching Hospital labs.',
        accessNote: 'Integrated directly with PACE industry internships.',
      },
      {
        category: 'Design & Media Studios',
        name: 'Macquarie 4K Broadcast & Podcast Studios',
        details:
          'Sound-treated journalism studio, TV green screen, and editing suites in the Arts Precinct.',
        accessNote: 'Open for Media, Marketing & Communications students.',
      },
      {
        category: 'Libraries & 24/7 Hubs',
        name: 'Wally’s Walk Library (Automated Book Storage)',
        details:
          'Massive sunny study hub with Automated Storage & Retrieval robots, 24/7 commons, and VR study rooms.',
        accessNote: 'Central Courtyard 24-hour student lounges right next door.',
      },
      {
        category: 'Sports & Wellness',
        name: 'Macquarie University Sport & Aquatic Centre',
        details:
          '50m outdoor + 25m indoor pools, gymnastics arena, squash courts, and multi-field sports park.',
        accessNote: 'Directly beside Central Courtyard housing and Metro station.',
      },
    ],
  },

  qut: {
    universityId: 'qut',
    officialPortalUrl: 'https://www.qut.edu.au/study',
    majorUrls: {
      ux_graphic_design: 'https://www.qut.edu.au/courses/bachelor-of-design',
      marketing_media: 'https://www.qut.edu.au/courses/bachelor-of-communication',
      mechatronics: 'https://www.qut.edu.au/courses/bachelor-of-engineering-honours',
      cs_ai: 'https://www.qut.edu.au/courses/bachelor-of-information-technology',
      education_edtech: 'https://www.qut.edu.au/courses/bachelor-of-education-secondary',
      hospitality_tourism: 'https://www.qut.edu.au/courses/bachelor-of-business',
    },
    dormSources: [
      {
        label: 'QUT Student Accommodation Guide',
        url: 'https://www.qut.edu.au/study/student-life/accommodation',
        category: 'dorm',
        note: 'Verified Brisbane housing & homestay advisory service',
      },
      {
        label: 'UniLodge Kelvin Grove & Gardens Point',
        url: 'https://www.unilodge.com.au/student-accommodation-brisbane',
        category: 'partner',
        note: 'Campus-adjacent apartments inside Kelvin Grove Creative Village',
      },
      {
        label: 'Scape South Bank & Toowong',
        url: 'https://www.scape.com/en-au/student-accommodation/brisbane',
        category: 'partner',
        note: 'Walkable across Goodwill Bridge to QUT Gardens Point',
      },
    ],
    facilitiesSummary:
      'Dual Brisbane campuses pairing Gardens Point (Botanic Gardens & Robotics) with the Creative Industries Precinct at Kelvin Grove.',
    musicHighlight:
      'Creative Industries Precinct (Z9 Block) features industry-grade 48-channel Neve recording studios, 16 soundproof rehearsal rooms, and The Loft performance theatre.',
    dormMusicAndLounges:
      'Kelvin Grove Urban Village housing sits steps from QUT Creative Studios and includes shared music/cinema lounges and rooftop pools.',
    nonMajorMusicAccess: false,
    facilitiesUrl: 'https://www.qut.edu.au/about/campuses-and-facilities',
    musicUrl: 'https://www.qut.edu.au/study/creative-industries',
    spaces: [
      {
        category: 'Music & Performing Arts',
        name: 'Kelvin Grove Music Studios & Roundhouse Theatre',
        details:
          'Soundproof recording booths, ensemble rehearsal suites, synth labs, and La Boite Roundhouse Theatre.',
        accessNote: 'Priority for Creative Industries & Music majors; showcase nights open to all.',
      },
      {
        category: 'STEM & Makerspaces',
        name: 'Science & Engineering Centre (The Cube) & Robotics',
        details:
          '2-storey interactive digital Cube wall, QUT Centre for Robotics lab, and Formula SAE electric car workshop.',
        accessNote: 'Public digital wall + badge access to Engineering maker bays.',
      },
      {
        category: 'Design & Media Studios',
        name: 'QUT Creative Industries Precinct & Esports Arena',
        details:
          'Australia’s first official university Esports Arena alongside game dev labs, motion-capture, and fashion workshops.',
        accessNote: 'Esports Arena open to all students via QUT Tigers club.',
      },
      {
        category: 'Libraries & 24/7 Hubs',
        name: 'Gardens Point & Kelvin Grove Libraries',
        details:
          'Overlooking Brisbane City Botanic Gardens with 24/7 digital collaboration zones and quiet study pods.',
        accessNote: 'Round-the-clock card access on Level 2–3 commons.',
      },
      {
        category: 'Sports & Wellness',
        name: 'YMCA QUT Fitness & Riverfront Trails',
        details:
          'On-campus fitness center, 25m Kelvin Grove heated pool, and Goodwill Bridge running/cycling loop.',
        accessNote: 'Student rates across both Brisbane campuses.',
      },
    ],
  },

  nus: {
    universityId: 'nus',
    officialPortalUrl: 'https://www.nus.edu.sg/oam/undergraduate-programmes',
    majorUrls: {
      cs_ai: 'https://www.comp.nus.edu.sg/programmes/ug/cs/',
      fintech_ba: 'https://bba.nus.edu.sg/',
      mechatronics: 'https://cde.nus.edu.sg/undergraduate/',
      architecture_urban: 'https://cde.nus.edu.sg/arch/programmes/bachelor-of-arts-in-architecture/',
      law_ir: 'https://law.nus.edu.sg/prospective-students/undergraduate-programmes/',
      biotech_env: 'https://www.dbs.nus.edu.sg/education/undergraduate-studies/',
    },
    dormSources: [
      {
        label: 'NUS Office of Student Affairs — Hostels',
        url: 'https://osa.nus.edu.sg/accommodation',
        category: 'dorm',
        note: 'Halls of Residence, UTown Residential Colleges & Houses (2-yr guarantee)',
      },
      {
        label: 'NUS University Town (UTown) Colleges',
        url: 'https://utown.nus.edu.sg/',
        category: 'dorm',
        note: 'Tembusu, CAPT, Cinnamon & RC4 live-learn residential hub',
      },
      {
        label: 'Singapore Student Housing & Hostels Guide',
        url: 'https://www.student.com/sg/singapore',
        category: 'partner',
        note: 'Approved off-campus student hostels & co-living across Clementi/Queenstown',
      },
    ],
    facilitiesSummary:
      'World-class Kent Ridge & UTown smart campus featuring Stephen Riady Centre, 24/7 infinity pool, MakerLabs, and Yong Siew Toh Conservatory.',
    musicHighlight:
      'NUS Centre For the Arts (CFA) + UTown & Hall Practice Rooms give students access to jam studios, Chinese orchestra rooms, grand pianos, and University Cultural Centre concert hall.',
    dormMusicAndLounges:
      'Every NUS Hall (Eusoff, Temasek, Sheares, Kent Ridge) and UTown Residential College features 24/7 jam band rooms, grand pianos, dance studios, and air-conditioned sky lounges.',
    nonMajorMusicAccess: true,
    facilitiesUrl: 'https://uci.nus.edu.sg/su/facilities-services/',
    musicUrl: 'https://cfa.nus.edu.sg/',
    spaces: [
      {
        category: 'Music & Performing Arts',
        name: 'NUS Centre For the Arts & UTown Jam Studios',
        details:
          '20+ bookable rehearsal & piano studios, 1,700-seat University Cultural Centre Hall, and Hall cultural band rooms.',
        accessNote: 'Open to all NUS undergraduates via CFA Arts clubs & residential halls.',
      },
      {
        category: 'STEM & Makerspaces',
        name: 'COM3 AI Labs & Innovation 4.0 Makerspace',
        details:
          'NVIDIA DGX deep-learning clusters, autonomous robotics arenas, cleanrooms, and 3D fabrication workshops.',
        accessNote: 'Accessible across Computing, Engineering & NOC startup teams.',
      },
      {
        category: 'Design & Media Studios',
        name: 'CDE Architecture Studios & Digital Fabrication',
        details:
          'Net-Zero Energy SDE4 studio building, laser cutting workshops, and UX design laboratories.',
        accessNote: '24-hour studio card access for CDE cohorts.',
      },
      {
        category: 'Libraries & 24/7 Hubs',
        name: 'Central Library & UTown Mac Commons',
        details:
          '24-hour Mac & PC study commons at Education Resource Centre alongside Central Library quiet floors.',
        accessNote: 'UTown ERC commons open 24/7 year-round.',
      },
      {
        category: 'Sports & Wellness',
        name: 'UTown Infinity Pool & USC Sports Complex',
        details:
          'Rooftop-style infinity swimming pool in UTown, Olympic pool, bouldering wall, and Inter-Hall sports arenas.',
        accessNote: 'Free access for all full-time NUS students.',
      },
    ],
  },

  ntu: {
    universityId: 'ntu',
    officialPortalUrl: 'https://www.ntu.edu.sg/admissions/undergraduate-programmes',
    majorUrls: {
      mechatronics: 'https://www.ntu.edu.sg/mae/admissions/programmes/undergraduate-programmes',
      cs_ai: 'https://www.ntu.edu.sg/computing/admissions/undergraduate-programmes',
      marketing_media: 'https://www.ntu.edu.sg/wkwsci/admissions/undergraduate-programmes',
      ux_graphic_design: 'https://www.ntu.edu.sg/adm/admissions/undergraduate-programmes',
      fintech_ba: 'https://www.ntu.edu.sg/nbs/admissions/programmes/undergraduate-programmes',
      biotech_env: 'https://www.ntu.edu.sg/sbs/admissions/undergraduate-programmes',
    },
    dormSources: [
      {
        label: 'NTU Office of Campus Housing (24 Halls)',
        url: 'https://www.ntu.edu.sg/life-at-ntu/accommodation/undergraduate-housing',
        category: 'dorm',
        note: 'Guaranteed 2-year on-campus Hall living inside Yunnan Garden campus',
      },
      {
        label: 'NTU Residential Education & Hall Profiles',
        url: 'https://www.ntu.edu.sg/life-at-ntu/student-life/residential-life',
        category: 'dorm',
        note: 'Details on North Hill, Tanjong, Crescent, Pioneer & Saraca Halls',
      },
      {
        label: 'Singapore Student.com Co-Living',
        url: 'https://www.student.com/sg/singapore',
        category: 'partner',
        note: 'Off-campus options across Jurong West & Boon Lay',
      },
    ],
    facilitiesSummary:
      'Eco-Smart Yunnan Garden campus famed for Thomas Heatherwick’s "Dim Sum" Hive hub, timber Wave sports hall, and 24 residential halls.',
    musicHighlight:
      'NTU Cultural Activities Club + Nanyang Auditorium and Hall Jam Rooms feature soundproof band studios, drum kits, keyboards, and NIE performing arts stages.',
    dormMusicAndLounges:
      'Each of NTU’s 24 residential halls includes jam rooms, dance mirrors, shared air-conditioned kitchens, and Late-Night Hall canteens.',
    nonMajorMusicAccess: true,
    facilitiesUrl: 'https://www.ntu.edu.sg/life-at-ntu/student-life',
    musicUrl: 'https://www.ntu.edu.sg/life-at-ntu/student-life/arts-and-culture',
    spaces: [
      {
        category: 'Music & Performing Arts',
        name: 'Hall Band Rooms & Nanyang Auditorium',
        details:
          '24+ hall jam/piano rooms, NTU Symphonic Band rehearsal suite, and 1,700-seat Nanyang Auditorium.',
        accessNote: 'Available free to all hall residents and NTU arts club members.',
      },
      {
        category: 'STEM & Makerspaces',
        name: 'The Arc, Robotics Centre & Innovation Lab',
        details:
          'Autonomous shuttle test track, humanoid robotics labs, 3D metal printers, and semiconductor cleanrooms.',
        accessNote: 'Open across Engineering, Computing & Renaissance Engineering tracks.',
      },
      {
        category: 'Design & Media Studios',
        name: 'School of Art, Design & Media (ADM) Grass Roof',
        details:
          '4K cinema soundstages, game design studios, darkrooms, and Wee Kim Wee TV newsroom.',
        accessNote: '24/7 lab access for ADM & Communication cohorts.',
      },
      {
        category: 'Libraries & 24/7 Hubs',
        name: 'The Hive Learning Hub & Lee Wee Nam Library',
        details:
          '56 smart tutorial pods inside The Hive plus 24-hour Outpost reading rooms during exam weeks.',
        accessNote: 'Collaborative pods open across South & North Spine.',
      },
      {
        category: 'Sports & Wellness',
        name: 'The Wave Sports Hall & Olympic Aquatic Complex',
        details:
          'Architectural mass-timber indoor arena, 50m Olympic pool, rock wall, and track stadium.',
        accessNote: 'Complimentary gym & swim access for all undergraduates.',
      },
    ],
  },

  imperial: {
    universityId: 'imperial',
    officialPortalUrl: 'https://www.imperial.ac.uk/study/courses/',
    majorUrls: {
      cs_ai: 'https://www.imperial.ac.uk/study/courses/undergraduate/computing/',
      mechatronics: 'https://www.imperial.ac.uk/study/courses/undergraduate/mechanical-engineering/',
      biotech_env: 'https://www.imperial.ac.uk/study/courses/undergraduate/biotechnology/',
      medicine_health: 'https://www.imperial.ac.uk/study/courses/undergraduate/medicine/',
    },
    dormSources: [
      {
        label: 'Imperial Official Accommodation Portal',
        url: 'https://www.imperial.ac.uk/study/campus-life/accommodation/',
        category: 'dorm',
        note: 'South Kensington (Beit, Eastside, Southside) & North Acton Halls',
      },
      {
        label: 'Imperial Halls Comparison & Fees',
        url: 'https://www.imperial.ac.uk/study/campus-life/accommodation/halls/',
        category: 'dorm',
        note: 'Detailed floorplans, en-suite options & weekly GBP rates',
      },
      {
        label: 'University of London Housing Services',
        url: 'https://housing.london.ac.uk/',
        category: 'partner',
        note: 'Trusted London private housing contract checker & student flats',
      },
    ],
    facilitiesSummary:
      'South Kensington STEM & Innovation campus steps from the Royal Albert Hall, featuring the Advanced Hackspace and Dyson Engineering Centre.',
    musicHighlight:
      'The Blyth Centre for Music & Visual Arts offers 6 free soundproof Steinway/Yamaha practice rooms right in South Kensington, plus free weekly chamber concerts — open to ALL STEM & Med students!',
    dormMusicAndLounges:
      'Beit Hall (adjacent to Royal Albert Hall) and Eastside/Southside Halls feature bookable piano practice rooms, games rooms, and Imperial Union social spaces.',
    nonMajorMusicAccess: true,
    facilitiesUrl: 'https://www.imperial.ac.uk/study/campus-life/',
    musicUrl:
      'https://www.imperial.ac.uk/be-inspired/the-blyth-centre-for-music-and-visual-arts/music/practice-rooms/',
    spaces: [
      {
        category: 'Music & Performing Arts',
        name: 'Blyth Centre Practice Rooms (Steinway & Orchestra)',
        details:
          'Acoustic rooms stocked with Steinway & Yamaha grand/upright pianos, harpsichord, percussion, plus Royal College of Music partnership.',
        accessNote: 'Completely free to book for every Imperial student regardless of degree.',
      },
      {
        category: 'STEM & Makerspaces',
        name: 'Imperial College Advanced Hackspace (White City & South Ken)',
        details:
          'Bio-hack lab, robotic arms, laser cutters, electronics benches, and Formula Student race-car workshop.',
        accessNote: 'Free induction grants access to all Hackspace prototyping bays.',
      },
      {
        category: 'Design & Media Studios',
        name: 'Dyson School of Design Engineering Studios',
        details:
          'Human-centered prototyping workshops, VR testing rooms, and rapid polymer/CNC fabrication.',
        accessNote: 'Open to Design Engineering & cross-faculty hackathons.',
      },
      {
        category: 'Libraries & 24/7 Hubs',
        name: 'Abdus Salam Library (24/7 South Kensington)',
        details:
          '5-storey STEM library open 24 hours a day with quiet silent floors and collaborative Bloomberg terminals.',
        accessNote: 'Open 24/7 almost every day of the academic year.',
      },
      {
        category: 'Sports & Wellness',
        name: 'Ethos Sports Centre (Prince’s Gardens)',
        details:
          '25m indoor swimming pool, 9m climbing wall, squash courts, and double-height fitness suite.',
        accessNote: 'Free base membership for all Imperial students.',
      },
    ],
  },

  ucl: {
    universityId: 'ucl',
    officialPortalUrl: 'https://www.ucl.ac.uk/study/undergraduate/degrees',
    majorUrls: {
      architecture_urban: 'https://www.ucl.ac.uk/study/undergraduate/degrees/architecture-bsc',
      psychology_social: 'https://www.ucl.ac.uk/study/undergraduate/degrees/psychology-bsc',
      law_ir: 'https://www.ucl.ac.uk/study/undergraduate/degrees/law-llb',
      education_edtech: 'https://www.ucl.ac.uk/study/undergraduate/degrees/education-studies-ba',
      cs_ai: 'https://www.ucl.ac.uk/study/undergraduate/degrees/computer-science-bsc',
      fintech_ba: 'https://www.ucl.ac.uk/study/undergraduate/degrees/economics-bsc',
    },
    dormSources: [
      {
        label: 'UCL Official Accommodation Portal',
        url: 'https://www.ucl.ac.uk/accommodation/',
        category: 'dorm',
        note: 'Ramsay Hall, Astor College, Ian Baker & UCL East One Pool Street',
      },
      {
        label: 'University of London Intercollegiate Halls',
        url: 'https://halls.london.ac.uk/',
        category: 'dorm',
        note: 'Connaught, Garden Halls, Nutford & Lillian Penson shared with London unis',
      },
      {
        label: 'Unite Students London',
        url: 'https://www.unitestudents.com/london',
        category: 'partner',
        note: 'St Pancras Way & Bloomsbury partner student halls',
      },
    ],
    facilitiesSummary:
      'Central Bloomsbury campus plus Olympic Park UCL East hub, featuring the #1-ranked Bartlett architecture workshops, Bloomsbury Theatre, and Student Centre.',
    musicHighlight:
      'Bloomsbury Theatre & Studio + UCL Music Society Practice Rooms (including upright & grand pianos in South Cloisters & Bloomsbury) allow non-music majors to rehearse and stage concerts.',
    dormMusicAndLounges:
      'Ramsay Hall, Astor College, and Intercollegiate Garden Halls house resident music rooms with acoustic pianos, communal kitchens, and Bloomsbury courtyards.',
    nonMajorMusicAccess: true,
    facilitiesUrl: 'https://www.ucl.ac.uk/students/life-ucl/student-facilities',
    musicUrl: 'https://www.ucl.ac.uk/bloomsbury-theatre',
    spaces: [
      {
        category: 'Music & Performing Arts',
        name: 'Bloomsbury Theatre & UCL Music Practice Rooms',
        details:
          '547-seat professional West End-grade theatre, acoustic rehearsal rooms, orchestra kits, and studio theatre.',
        accessNote: 'Available via Students’ Union Music, Jazz, Chamber & Musical Theatre societies.',
      },
      {
        category: 'STEM & Makerspaces',
        name: 'Institute of Making & UCL East Robotics Lab',
        details:
          '1,000+ exotic materials library, woodworking, metal lathe, AI robotics pods, and Marshgate cleanrooms.',
        accessNote: 'Institute of Making membership open free to any UCL student or staff.',
      },
      {
        category: 'Design & Media Studios',
        name: 'The Bartlett B-Made Fabrication Workshop',
        details:
          '6-axis industrial robotic milling arms, laser workshops, and world-famous architecture studio floors at 22 Gordon St.',
        accessNote: 'Open 7 days during design crits & exhibitions.',
      },
      {
        category: 'Libraries & 24/7 Hubs',
        name: 'UCL Student Centre & Science Library',
        details:
          '1,000-seat sustainable flagship Student Centre open 24/7 right on Gordon Square with quiet rooftop terraces.',
        accessNote: '24/7 student ID access across Student Centre & Cruciform Hub.',
      },
      {
        category: 'Sports & Wellness',
        name: 'Bloomsbury Fitness & Shenley Sports Grounds',
        details:
          'Multi-level fitness studio in Bloomsbury plus London Aquatics Centre access at UCL East.',
        accessNote: 'Subsidized student gym memberships.',
      },
    ],
  },

  kcl: {
    universityId: 'kcl',
    officialPortalUrl: 'https://www.kcl.ac.uk/study/undergraduate',
    majorUrls: {
      law_ir: 'https://www.kcl.ac.uk/study/undergraduate/courses/law-llb',
      psychology_social: 'https://www.kcl.ac.uk/study/undergraduate/courses/psychology-bsc',
      marketing_media: 'https://www.kcl.ac.uk/study/undergraduate/courses/digital-media-and-culture-ba',
      fintech_ba: 'https://www.kcl.ac.uk/study/undergraduate/courses/economics-and-management-bsc',
      medicine_health: 'https://www.kcl.ac.uk/study/undergraduate/courses/medicine-mbbs',
      languages_translation: 'https://www.kcl.ac.uk/study/undergraduate/courses/international-relations-ba',
    },
    dormSources: [
      {
        label: 'King’s Residences Official Portal',
        url: 'https://www.kcl.ac.uk/accommodation',
        category: 'dorm',
        note: 'Stamford Street, Great Dover St, Moonraker Point & Angel Lane',
      },
      {
        label: 'UoL Intercollegiate Halls (King’s Allocation)',
        url: 'https://halls.london.ac.uk/',
        category: 'dorm',
        note: 'Catered London Zone 1 halls for first-year King’s applicants',
      },
      {
        label: 'Student.com Central London Housing',
        url: 'https://www.student.com/uk/london',
        category: 'partner',
        note: 'Waterloo & Southwark Zone 1 private student studios',
      },
    ],
    facilitiesSummary:
      'Iconic Strand & Somerset House East Wing campus beside the Thames, paired with Bush House innovation floors and Guy’s biomedical campus.',
    musicHighlight:
      'Strand Chapel Choir & King’s Music Practice Rooms (Strand Building & Somerset House) provide upright/grand pianos, ensemble rehearsal suites, and close proximity to Southbank Centre.',
    dormMusicAndLounges:
      'Great Dover Street, Stamford Street, and Moonraker Point feature communal cinema rooms, piano lounges, and Zone 1 courtyard study spaces.',
    nonMajorMusicAccess: true,
    facilitiesUrl: 'https://www.kcl.ac.uk/campus-life',
    musicUrl: 'https://www.kcl.ac.uk/music',
    spaces: [
      {
        category: 'Music & Performing Arts',
        name: 'King’s Music Studios & Strand Chapel',
        details:
          'Practice rooms with acoustic pianos, King’s College London Symphony Orchestra rehearsal halls, and early-music organs.',
        accessNote: 'Bookable by Department of Music students and KCLSU Music Society performers.',
      },
      {
        category: 'STEM & Makerspaces',
        name: 'Bush House King’s Entrepreneurship Institute & Science Labs',
        details:
          'Startup co-working accelerator floor, robotics prototyping suites, and Guy’s anatomy/biomedical labs.',
        accessNote: 'Entrepreneurship hub open to all faculties for venture building.',
      },
      {
        category: 'Design & Media Studios',
        name: 'Digital Humanities & Media Production Lab',
        details:
          'Audio/video editing labs, podcast booths, and Strand Arcade cultural exhibition gallery.',
        accessNote: 'Accessible across Media, Arts & Humanities programs.',
      },
      {
        category: 'Libraries & 24/7 Hubs',
        name: 'Maughan Library (Gothic Round Reading Room)',
        details:
          'Historic 19th-century neo-Gothic Chancery Lane library with silent domes and 24-hour exam period opening.',
        accessNote: 'Plus Bush House & Waterloo Franklin-Wilkins study libraries.',
      },
      {
        category: 'Sports & Wellness',
        name: 'King’s Sport Strand, Waterloo & Guy’s Gyms',
        details:
          'Three central London fitness hubs plus Honor Oak Park rugby/football grounds and rowing boathouse.',
        accessNote: 'Multi-campus Zone 1 gym access.',
      },
    ],
  },

  utoronto: {
    universityId: 'utoronto',
    officialPortalUrl: 'https://www.utoronto.ca/academics/programs-directory',
    majorUrls: {
      cs_ai: 'https://web.cs.toronto.edu/undergraduate-programs/',
      fintech_ba: 'https://rotmancommerce.utoronto.ca/future-students/',
      psychology_social: 'https://www.psych.utoronto.ca/undergraduate-program',
      biotech_env: 'https://future.utoronto.ca/academics/undergraduate-programs/',
      architecture_urban: 'https://www.daniels.utoronto.ca/academics/undergraduate/architectural-studies',
      law_ir: 'https://www.politics.utoronto.ca/undergraduate',
    },
    dormSources: [
      {
        label: 'U of T StarRez Housing & First-Year Guarantee',
        url: 'https://studentlife.utoronto.ca/task/find-housing/',
        category: 'dorm',
        note: '7 St. George College Residences (Trinity, Victoria, Innis, New, SMC)',
      },
      {
        label: 'Chestnut Residence (Downtown U of T)',
        url: 'https://chestnut.utoronto.ca/',
        category: 'dorm',
        note: 'All-inclusive catered rooms with meal plan minutes from St. George',
      },
      {
        label: 'U of T Official Off-Campus Housing Finder',
        url: 'https://offcampushousing.utoronto.ca/',
        category: 'partner',
        note: 'University-vetted Toronto apartments & roommate matching portal',
      },
    ],
    facilitiesSummary:
      'Historic St. George collegiate campus in downtown Toronto featuring Robarts Library, Myhal Engineering Innovation Centre, and Hart House.',
    musicHighlight:
      'Hart House Music Room & 30+ Faculty of Music Practice Rooms — Hart House preserves historic Steinway grand pianos & practice booths open for ANY U of T student to book regardless of major!',
    dormMusicAndLounges:
      'Colleges like Victoria (Rowell Jackman Hall), Trinity, and Chestnut feature dedicated soundproofed basement piano rooms, theatre stages, and dining commons.',
    nonMajorMusicAccess: true,
    facilitiesUrl: 'https://www.utoronto.ca/university-life/campuses/st-george',
    musicUrl: 'https://harthouse.ca/spaces/music-room',
    spaces: [
      {
        category: 'Music & Performing Arts',
        name: 'Hart House Music Room & Edward Johnson Building',
        details:
          'Bookable Steinway concert parlours at Hart House, 60+ practice booths, Walter Hall, and MacMillan Theatre.',
        accessNote: 'Hart House open to ALL majors via membership included in tuition; EJB for Music.',
      },
      {
        category: 'STEM & Makerspaces',
        name: 'Myhal Centre for Engineering Innovation & Entrepreneurship',
        details:
          '24/7 Fabrication Studio, 3D printing farm, drone & autonomous rover bay, and Vector AI research link.',
        accessNote: 'Open across Engineering & Computer Science hackathons and design courses.',
      },
      {
        category: 'Design & Media Studios',
        name: 'John H. Daniels Architecture Building (1 Spadina)',
        details:
          'Iconic circular glass Principal Hall, CNC milling robots, laser workshops, and massive studio tables.',
        accessNote: '24/7 studio access for Daniels Architecture & Visual Studies.',
      },
      {
        category: 'Libraries & 24/7 Hubs',
        name: 'Robarts Library, Robarts Common & Thomas Fisher Rare Book',
        details:
          'North America’s 3rd-largest academic library system with 24/7 Robarts Common 5-storey glass study wing.',
        accessNote: 'TCard student access across 40+ campus libraries.',
      },
      {
        category: 'Sports & Wellness',
        name: 'Goldring Centre & Athletic Centre (50m Olympic Pool)',
        details:
          'Olympic pool, 200m indoor track, Varsity Stadium, and NBA-grade Goldring basketball arena.',
        accessNote: 'Included in student incidental fees for all St. George students.',
      },
    ],
  },

  auckland: {
    universityId: 'auckland',
    officialPortalUrl: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option.html',
    majorUrls: {
      cs_ai: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/computer-science.html',
      mechatronics: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/mechatronics-engineering.html',
      architecture_urban: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/architectural-studies.html',
      fintech_ba: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/finance.html',
      education_edtech: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/education.html',
      hospitality_tourism: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/marketing.html',
    },
    dormSources: [
      {
        label: 'University of Auckland Accommodation Portal',
        url: 'https://www.auckland.ac.nz/en/on-campus/accommodation/accommodation-options.html',
        category: 'dorm',
        note: 'Waipārūrū Hall, University Hall Towers, O’Rorke & Grafton Halls',
      },
      {
        label: 'Waipārūrū Hall (Catered Year 1 Flagship)',
        url: 'https://www.auckland.ac.nz/en/on-campus/accommodation/accommodation-options/catered-halls/waiparuru-hall.html',
        category: 'dorm',
        note: 'Modern twin towers beside Symonds St with dining hall & study spaces',
      },
      {
        label: 'UniLodge Auckland City & Whitaker',
        url: 'https://www.unilodge.com.au/student-accommodation-auckland',
        category: 'partner',
        note: 'Self-catered CBD student studios within 5-min walk of campus',
      },
    ],
    facilitiesSummary:
      'Harbour-city campus beside Albert Park featuring Unleash Space innovation makerspace, Hiwa Recreation Centre, and Kenneth Myers music studios.',
    musicHighlight:
      'School of Music (Symonds St) & Kenneth Myers Centre offer acoustic practice booths, Steinway pianos, gamelan/jazz rehearsal rooms, and electroacoustic composition suites.',
    dormMusicAndLounges:
      'Waipārūrū Hall and O’Rorke Hall feature dedicated sound-treated music rooms with pianos & guitars, cinema lounges, and rooftop BBQ decks.',
    nonMajorMusicAccess: true,
    facilitiesUrl: 'https://www.auckland.ac.nz/en/on-campus/facilities-and-services.html',
    musicUrl:
      'https://www.auckland.ac.nz/en/arts/current-students/studios-workshops-equipment/music-practice-composition.html',
    spaces: [
      {
        category: 'Music & Performing Arts',
        name: 'School of Music Practice Rooms & Kenneth Myers Centre',
        details:
          '20+ practice studios, 16-channel recording lab, Music Theatre, and ensemble studios on Symonds St.',
        accessNote: 'Priority for Music & Creative Arts students; dorm music rooms open to all residents.',
      },
      {
        category: 'STEM & Makerspaces',
        name: 'Unleash Space & Engineering B405 Robotics Hall',
        details:
          'Free open-access 1,000 sqm innovation makerspace with laser cutters, 3D printers, VR rigs, and drone test cage.',
        accessNote: 'Unleash Space is completely free to ALL University of Auckland students.',
      },
      {
        category: 'Design & Media Studios',
        name: 'CAI Architecture & Creative Arts Workshops',
        details:
          'Timber/metal model labs, screen-printing studio, and digital media editing suites.',
        accessNote: 'Open across Architecture, Design & Fine Arts degrees.',
      },
      {
        category: 'Libraries & 24/7 Hubs',
        name: 'Kate Edger Information Commons & General Library',
        details:
          'Flagship 5-floor glass student commons beside Albert Park with laptop lending and late-night exam study zones.',
        accessNote: 'Extended 24/7 commons hours during assessment weeks.',
      },
      {
        category: 'Sports & Wellness',
        name: 'Hiwa, University of Auckland Recreation Centre',
        details:
          'Brand-new 6-level wellness hub featuring rooftop turf, 25m pool, climbing wall, and multi-sport halls.',
        accessNote: 'Discounted student memberships steps from Waipārūrū Hall.',
      },
    ],
  },
};

export function getUniversityExtendedProfile(
  universityId: string
): UniversityExtendedProfile | undefined {
  return UNIVERSITY_EXTENDED_PROFILES[universityId];
}
