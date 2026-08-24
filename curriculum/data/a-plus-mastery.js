/* Khaemenes Kinder Garden · A++++ week-specific mastery rubrics */
(function(global){
  "use strict";
  const R={
    5:[
      ["Unit idea","Explains or shows a real change noticed in nature or seasonal weather."],
      ["Literacy","Uses a nature word and demonstrates the Week 5 beginning-sound focus.",true],
      ["Listening / reading","Responds to a nature/season text with a relevant idea or question."],
      ["Writing / fine motor","Communicates a Week 5 observation through an accessible form."],
      ["Mathematics / pattern","Creates or extends a repeating AB, AAB, or ABB pattern.",true],
      ["Math reasoning","Shows or explains which part of a repeating pattern repeats."],
      ["Inquiry","Distinguishes an observation from a guess and uses observation to support a simple prediction.",true],
      ["Maker / arts","Contributes to a nature artifact containing a repeating pattern."],
      ["Social-emotional","Practices patience, wonder, safe observation, and revision."],
      ["Participation","Participates safely and kindly across the week."]
    ],
    6:[
      ["Weather communication","Uses accurate weather vocabulary and gives an evidence-based present observation.",true],
      ["Observation vs inference","Distinguishes observation from imagination or unsupported prediction."],
      ["Listening / shared writing","Contributes to a weather text or discussion."],
      ["Weather data","Reads or creates a simple weather graph and compares categories.",true],
      ["Data reasoning","Makes a graph-supported claim without treating a short sample as a guaranteed forecast."],
      ["Sunlight / shade inquiry","Explains or demonstrates safe shadow formation.",true],
      ["Sun and severe-weather safety","Knows never to look directly at the Sun and uses trusted-adult safety for dangerous weather.",true],
      ["Weather-ready design","Uses a locally meaningful weather tool."],
      ["Reasoned choice","Explains a weather-ready choice."],
      ["Weather report / reflection","Communicates an evidence-based report and reflection."]
    ],
    7:[
      ["Shape properties","Describes common shapes by properties and recognizes identity across rotation or size.",true],
      ["2D / 3D distinction","Distinguishes a flat shape from a solid."],
      ["Spatial language","Uses positional language accurately.",true],
      ["Shape composition","Combines shapes or solids and identifies components.",true],
      ["Attribute classification","Sorts by at least two different attributes."],
      ["Color / visual design observation","Uses accessible visual or tactile attributes without color-only coding."],
      ["Geometry-rich design","Creates or interprets a geometry-rich design."],
      ["Design reasoning and revision","Tests, notices evidence, and revises or explains a design.",true],
      ["Mathematical communication","Explains a design with property and spatial language."],
      ["Persistence / reflection","Persists and reflects."]
    ],
    8:[
      ["Repeating pattern rule","Identifies the smallest repeating unit and distinguishes pattern from irregular sequence.",true],
      ["Pattern reasoning","Repairs or explains a repeating rule."],
      ["Beat and rhythm","Distinguishes steady beat or pulse from rhythm using an accessible form.",true],
      ["Syllable and rhyme","Distinguishes syllables from rhyme in a familiar language.",true],
      ["Pattern translation","Translates one pattern into at least two forms while preserving structure.",true],
      ["Representation reasoning","Explains what changed and stayed the same."],
      ["Pattern performance / maker","Creates an original repeating sequence or performance."],
      ["Self-regulation and safety","Uses start/stop cues and safe, comfortable sensory choices.",true],
      ["Respectful creative choices","Uses material respectfully without cultural mockery or restricted copying."],
      ["Transfer / reflection","Transfers and reflects."]
    ],
    9:[
      ["Privacy and belonging","Describes belonging respectfully and knows fictional or non-private examples are valid.",true],
      ["Story sequence / oral history","Sequences and retells a three-part oral-history or fictional account.",true],
      ["Past and present","Distinguishes past and present and understands oral history as remembered account.",true],
      ["Measurement with equal units","Measures length or height with repeated same-size units from a common start.",true],
      ["Measurement comparison","Accurately compares measured lengths or heights."],
      ["Tradition without stereotype","Describes tradition as meaningful repeated practice that can vary or change using some/not-all reasoning.",true],
      ["Source and respect reasoning","Uses respectful source and question reasoning."],
      ["Private-information boundary","Identifies information a learner may choose not to share.",true],
      ["Integrated belonging artifact","Creates a safe artifact without sensitive-data requirements."],
      ["Reflection and respectful learning","Explains learning without assumptions."]
    ],
    10:[
      ["Map as model","Explains that a map is a selective representation of a place and identifies something it leaves out.",true],
      ["Symbols and legend","Creates or decodes consistent symbols using a legend or key that does not rely only on color.",true],
      ["Spatial and route language","Uses positional or directional language accurately from a stated start or orientation and sequences a usable route.",true],
      ["Consistent distance units","Measures or compares route distance using one consistent model unit rather than body-dependent stride length.",true],
      ["Route comparison","Compares two routes using the same unit and explains a meaningful difference."],
      ["Location privacy","Knows that home address, live location, school route, bus stop, exact neighborhood, or identifying landmark is never required.",true],
      ["Community access reasoning","Designs or interprets a fictional community map and explains a safety or accessibility choice.",true],
      ["Map limitation and purpose","Explains that maps are made for purposes and can represent the same place differently."],
      ["Map testing and revision","Tests a map or route, identifies ambiguity or exclusion, and revises or explains a correction."],
      ["Navigator reflection","Uses a map, key, route, and privacy or access principle together."]
    ],
    11:[
      ["Plant structures and functions","Identifies common plant structures such as roots, stems, leaves, flowers, fruits, or seeds and gives an age-appropriate function for at least two, without requiring every plant to have every part visible.",true],
      ["Living-plant needs","Explains that plants need suitable access to water, light, air, space, and appropriate growing conditions; avoids the misconception that soil itself is plant food.",true],
      ["Growth sequence","Orders an age-appropriate seed/germination/growth sequence while recognizing that different plants grow at different rates and not every seed germinates.",true],
      ["Growth measurement","Measures or compares plant/model growth from a consistent baseline using the same nonstandard unit or another accessible repeated measure.",true],
      ["Observation journal","Records at least two dated or ordered observations using drawing, marks, labels, dictation, photos of the plant only when appropriate, or another accessible evidence form."],
      ["Evidence vs prediction","Distinguishes what was observed from what is predicted and revises a prediction when evidence changes.",true],
      ["Fair-test thinking","Identifies that changing one condition at a time makes a comparison more informative, using a safe model, teacher demonstration, or hypothetical example."],
      ["Seed and plant safety","Uses adult guidance for unknown plants/seeds, avoids tasting classroom specimens, washes hands as appropriate, and uses choking/allergy-safe alternatives.",true],
      ["Care and stewardship","Demonstrates developmentally appropriate care for a living plant or uses a nonliving model when live-plant care is unavailable."],
      ["Plant scientist reflection","Explains one observation, measurement, or revised idea about how plants grow."]
    ],
    12:[
      ["Animal observation vs inference","Gives an evidence-based observation about an animal structure or behavior and distinguishes it from a guess, personality label, or human-like story.",true],
      ["Structure / behavior function","Explains an age-appropriate way one animal structure or behavior may help meet a need, without claiming every structure has only one function.",true],
      ["Evidence-based classification","States a classification rule before sorting and correctly sorts animal examples according to observable or known evidence.",true],
      ["Count and compare groups","Counts classified animal groups with one-to-one correspondence and compares them using more, fewer, same, difference, or numbers.",true],
      ["Some / not-all reasoning","Avoids absolute shortcuts such as 'all birds fly' and uses counterexamples or some/not-all language when appropriate."],
      ["Habitat resources and conditions","Connects at least two animal needs to habitat resources or conditions with a reasonable evidence-based explanation.",true],
      ["Habitat model reasoning","Builds, draws, arranges, or explains a habitat model with multiple need-linked features and identifies at least one limitation of the model.",true],
      ["Design testing and revision","Tests or reviews a habitat model, responds to an evidence question, and makes or explains one revision."],
      ["Humane wildlife boundary","Knows wild animals are observed from a distance and that feeding, touching, chasing, capturing, handling, or removing wildlife/nests/eggs is not required or authorized.",true],
      ["Animal scientist reflection","Integrates structure or behavior, need, habitat evidence, and one corrected/revised idea in an accessible explanation."]
    ],
    13:[
      ["Story sequence and retelling","Sequences and retells a three-part story with a sensible beginning, middle, and end while preserving important meaning rather than exact memorized wording.",true],
      ["Story evidence","Uses at least one story detail to explain why an event belongs in a particular place in the sequence."],
      ["Compose numbers to 5","Builds or represents a whole to 5 from two parts and correctly identifies the parts and whole.",true],
      ["Decompose numbers to 5","Takes apart a quantity to 5 in at least two valid ways and verifies that recombining the parts preserves the whole.",true],
      ["Number-story meaning","Models a joining, separating, or part-part-whole story accurately and does not assume that the social word 'giving' always means subtraction.",true],
      ["Community-care reasoning","Connects a visible or scenario-based care/helping action to a need or possible effect without stereotyping a job, identity, or group.",true],
      ["Consent and helping boundary","Knows that helping or gratitude never requires unsafe/secret actions, physical affection, forgiveness, money, gifts, or contact with someone the learner does not want to contact.",true],
      ["Authentic appreciation","Creates or explains a truthful appreciation, acknowledgment, or reflection using an accessible communication mode without forced emotion or private disclosure.",true],
      ["Economic and privacy fairness","Understands that generosity/gratitude are not measured by possessions, spending, family circumstances, public performance, or disclosure."],
      ["Integrated story-number reflection","Creates or explains a story that integrates sequence, a quantity to 5, an act of care, and a consent-respecting response."]
    ],
    14:[
      ["Rhyme recognition / generation","Identifies and generates an age-appropriate rhyme or equivalent patterned-language example in an appropriate spoken, signed, visual, or other accessible language pathway.",true],
      ["Rhyme vs spelling","Demonstrates that rhyme depends on a language's sound/pattern structure rather than simply matching final written letters.",true],
      ["Syllable segmentation","Segments and counts syllables in several familiar examples using speech, counters, taps, visual pulses, signs, or another accessible representation.",true],
      ["Syllable vs letter count","Demonstrates that syllable count and written-letter count are different ideas.",true],
      ["Beginning sound / feature","Identifies beginning phonological matches in an appropriate language pathway and groups examples by the stated feature.",true],
      ["Sound-letter distinction","Explains or demonstrates that written letters and speech sounds are related but not perfectly one-to-one, using an age-appropriate example.",true],
      ["Count and compare language units","Counts and compares rhyme/syllable/sound-pattern groups using one-to-one correspondence and more/fewer/same or numbers."],
      ["Rule-based word play","Creates a short rhyme, alliteration, syllable, or equivalent language pattern, identifies a break, and repairs it.",true],
      ["Language-access respect","Uses accent, dialect, home language, signed language, AAC, visual/tactile, or other appropriate access without treating speech volume, hearing, eye contact, or one accent as intelligence/mastery.",true],
      ["Language pattern reflection","Distinguishes at least two of rhyme, syllable, beginning sound, letter, and alliteration and reflects on language variation."]
    ],
    15:[
      ["Direct comparison from common start","Compares length or height by aligning objects at a common start/baseline and uses precise longer/shorter/taller/same language rather than an ambiguous size label.",true],
      ["Consistent nonstandard measurement","Measures a length with repeated equal-size nonstandard units from the endpoint without intentional gaps or overlaps.",true],
      ["Number plus unit communication","Reports a measurement as a number together with the unit and recognizes that changing unit size can change the count while the object stays the same length.",true],
      ["Measurement error detection","Identifies and repairs at least one unfair measurement such as mixed-size units, gaps, overlaps, or a misaligned start.",true],
      ["Weight reasoning","Uses safe evidence to compare heavier/lighter and understands that visual size alone does not determine weight.",true],
      ["Capacity reasoning","Distinguishes container capacity from the amount currently inside and compares capacity using consistent transfer units or an equivalent accessible model.",true],
      ["Attribute distinction","Distinguishes at least two of length/height, weight, and capacity and selects evidence appropriate to the named attribute.",true],
      ["Engineering constraint and fair test","Designs or interprets a small model bridge against a stated span/load criterion and tests alternatives under reasonably consistent conditions.",true],
      ["Evidence-based design revision","Uses test/measurement evidence to revise a design or explain why a revision should improve it.",true],
      ["Measurement access and safety","Demonstrates that body size, stride, strength, mobility, purchased materials, or dangerous real-world load testing are not required for measurement/engineering mastery."]
    ],
    16:[
      ["Needs and wants in context","Explains that needs and wants depend on a person's situation and gives a respectful reason why an item/support could be a need in one context without judging another household.",true],
      ["Economic privacy and dignity","Knows that family income, debt, housing, food insecurity, purchases, allowance, benefits, savings, gifts, possessions, or ability to afford something are private and never required for mastery; money/possessions do not determine human worth.",true],
      ["Token counting","Counts a modeled token set with one-to-one correspondence and states the total accurately.",true],
      ["Amount comparison","Counts and compares at least two modeled amounts using more, fewer, same, numerical totals, or an age-appropriate difference strategy.",true],
      ["Goods and services","Distinguishes a physical good from a service/action and connects each to a fictional need or goal without ranking work or workers.",true],
      ["Work and system respect","Recognizes paid, unpaid, household, public, volunteer, repair, reuse, care, and community contributions without stereotyping who does them."],
      ["Constrained choice and tradeoff","Uses a fictional token constraint to compare options, choose with a reason, and identify what is delayed or not chosen.",true],
      ["Saving reasoning without moralization","Explains saving as setting resources aside for later while recognizing that spending to meet a need can also be responsible and inability to save is not a character flaw.",true],
      ["Voluntary sharing and consent","Knows that sharing may be kind but never requires giving away personal money, food, comfort items, or possessions; classroom market materials remain fictional/shared.",true],
      ["Integrated decision reflection","Given a fictional need/goal and small modeled amount, counts resources, compares choices, identifies a good/service when relevant, explains a tradeoff, and revises the decision when one fact changes.",true]
    ],
    17:[
      ["Light source / shadow relationship","Identifies a light source, blocking object, and receiving surface/screen and explains that an opaque object can block light to produce a darker shadow region.",true],
      ["Controlled shadow change","Changes one light/object/screen condition at a time, observes the resulting shadow change, and uses evidence to confirm or revise a prediction.",true],
      ["Shadow geometry reasoning","Explains that shadow size, position, or outline can change with source/object/screen geometry without claiming that the object itself grew or shrank.",true],
      ["Consistent shadow measurement","Measures and compares modeled shadow lengths from a common baseline using equal repeated units and communicates number plus unit.",true],
      ["Measurement error and model limits","Identifies an unfair shadow measurement or model limitation such as shifted starts, mixed units, gaps/overlaps, or overgeneralizing one classroom setup."],
      ["Earth rotation / day-night","Uses a globe/ball and fixed-light model to explain that Earth’s rotation produces the repeating day/night pattern, rather than teaching that the Sun travels around Earth each day.",true],
      ["Seasonal / global reasoning","Compares seasonal or daylight information with location-aware language and rejects the claim that winter universally means snow, freezing weather, or identical daylight patterns.",true],
      ["Light investigation safety","Knows never to look directly at the Sun and never requires lasers, flames/candles, high-heat lamps, electrical disassembly, lights aimed at eyes, unsafe darkness, or unsupervised night/outdoor observation.",true],
      ["Accessible science participation","Uses safe visual, tactile, modeled, signed, AAC, audio-described, partner-supported, or adult-scribed pathways without making standing, visual acuity, flashlight handling, or fine-motor tracing prerequisites."],
      ["Integrated light scientist reflection","Integrates shadow formation, one controlled change, fair measurement, Earth-rotation reasoning, and one corrected misconception or model limitation in an accessible explanation.",true]
    ],
    18:[
      ["Cross-domain retrieval","Retrieves first-semester learning across literacy/language, mathematics, and inquiry through an accessible response mode before coaching and identifies at least one secure idea and one next teaching target.",true],
      ["Literacy transfer after remediation","Demonstrates a story, language-pattern, print/sound, or meaning concept on a new example after targeted reteaching rather than relying on memorized wording or performance style.",true],
      ["Mathematics transfer after remediation","Represents and solves a changed-example task using age-appropriate counting, comparison, composition/decomposition, pattern, geometry, spatial, or measurement reasoning and explains what stayed the same.",true],
      ["Inquiry and evidence transfer","Uses observation/evidence, model, classification, prediction/result, fair comparison, or revision reasoning in a new inquiry/community/design scenario.",true],
      ["Error analysis and repair","Identifies at least one error, misconception, weak strategy, or missing piece of evidence and demonstrates a correction, improved representation, or better strategy.",true],
      ["Privacy safety and dignity transfer","Applies an appropriate privacy, safety, consent, accessibility, humane-care, or economic-dignity boundary from prior learning without requiring personal disclosure.",true],
      ["Integrated practice demonstration","Combines communication with at least one mathematical representation and one inquiry/evidence idea in a novel practice task and identifies a relevant safety, limitation, or revision when appropriate.",true],
      ["Accessible mastery participation","Demonstrates the academic target through an appropriate accommodation or communication pathway without making speed, eye contact, handwriting fluency, loud speech, or public performance prerequisites."],
      ["Portfolio and growth reflection","Selects one work sample, model, drawing, or dictated explanation as evidence and explains one area of growth plus one reasonable next practice target."],
      ["Midyear authority boundary","Accurately explains that Week 18 daily practice and Week 18 mastery do not award midyear mastery; only after Weeks 1–18 are mastered does the separate midyear demonstration become eligible, and it still requires its own 80% adult-observed evidence.",true]
    ],
    19:[
      ["Evidence-based learning growth","Compares the learner's own earlier and current academic evidence, makes one supported growth or next-step claim, and avoids peer ranking or identity labels.",true],
      ["Observable academic goal","Creates or interprets a small academic learning goal that describes observable skill evidence rather than worth, compliance, personality, or a sensitive personal target.",true],
      ["Strategy and support plan","Identifies at least two plausible strategies, supports, access tools, or conditions for a learning goal and explains when one might be changed or added.",true],
      ["Forward number sequence","Continues a forward number sequence from a provided starting number using an accurate spoken, signed, AAC, visual, tactile, manipulative, or other accessible representation.",true],
      ["Backward number sequence","Represents a short backward number sequence accurately and distinguishes sequence practice from the mathematical meaning of subtraction.",true],
      ["Strategy comparison without speed","Uses or interprets two valid strategies for a number-sequence or learning task and compares them without treating speed, speech, or one body-dependent method as universally best.",true],
      ["Evidence-based strategy revision","Tests a strategy, notices evidence, and chooses a reasonable next move such as continue, change strategy, seek instruction/help, use an accommodation, pause/rest, change conditions, or revise the goal.",true],
      ["Growth-mindset nuance and access","Explains or demonstrates that effort alone is not a universal solution and that instruction, strategy, tools, accommodations, rest, time, environment, and access can affect learning; needing support is not a character failure.",true],
      ["Goal privacy and dignity","Knows goals may be private or changed and that no New Year observance, public goal chart, body/health, family-finance, religion, trauma, home-behavior, or other sensitive disclosure is required.",true],
      ["Integrated learning-growth reflection","Integrates personal evidence, an observable academic goal, strategy/support choice, number-sequence reasoning, one correction or barrier response, and a next-step evidence plan.",true]
    ]
  };
  global.KHAE_KINDER_A_PLUS_MASTERY=Object.freeze(R);
})(window);
