'use strict';

// Sample content and manually curated evidence. No live analysis.
window.LOGIQ_NEWS = {
  "repair": {
    "title": "New EU rules mean broken phones must be replaced, not repaired",
    "topic": "Technology & consumer rights",
    "url": "https://civic-wire.example/phone-repairs",
    "publisher": "Civic Wire · fictional publication",
    "lead": "A post circulating online claims that European repair rules leave consumers with no choice but to buy a new phone.",
    "paragraphs": [
      "“Europe has banned mobile-phone repairs,” the fictional post claims. “If your phone breaks, the new rules require you to replace it.”",
      "The same post also mentions measures intended to make spare parts and repair services easier to access. It does not explain how that fits with its headline.",
      "This is a deliberately fictional article for testing the LogiQ experience. Its claims are compared with the official resource below."
    ],
    "summary": "The central claim is contradicted by the selected official source. The article also contains a supported statement about access to repair.",
    "takeaway": "The cited EU policy promotes repair; it does not establish a ban on repairing phones.",
    "claims": [
      {
        "id": "ban",
        "text": "EU rules ban mobile-phone repairs and require replacement.",
        "status": "contradicted",
        "label": "Contradicted by this source",
        "explanation": "The Council of the EU describes measures that encourage repair, including repair requests for technically repairable products such as mobile phones.",
        "context": "Whether a particular device can be repaired, and on what terms, depends on the applicable rules and circumstances. This source does not promise every repair is free.",
        "evidence": [
          "eu-repair"
        ],
        "question": "Does the original policy say “replace”, or does the article reverse its meaning?"
      },
      {
        "id": "access",
        "text": "The measures include access to spare parts and information about repair services.",
        "status": "supported",
        "label": "Supported by this source",
        "explanation": "The Council’s overview includes access to spare parts and information about manufacturers’ repair services.",
        "context": "This supports this specific statement, not every sentence in the article. Check the relevant product and national implementation for a real consumer case.",
        "evidence": [
          "eu-repair"
        ],
        "question": "Which part of the source supports this exact statement?"
      }
    ],
    "sources": [
      {
        "id": "eu-repair",
        "publisher": "Council of the European Union",
        "title": "Right to repair products",
        "url": "https://www.consilium.europa.eu/en/policies/right-to-repair-products/",
        "date": "Page reviewed 31 July 2026",
        "type": "Official policy overview",
        "note": "Relevant sections: EU rules to boost repair and reuse; Obligation to repair.",
        "limitation": "An overview of the policy, not individual legal or repair advice."
      }
    ]
  },
  "solar": {
    "title": "Rooftop solar guarantees power whenever the grid goes down",
    "topic": "Energy & everyday decisions",
    "url": "https://civic-wire.example/solar-outages",
    "publisher": "Civic Wire · fictional publication",
    "lead": "A fictional guide makes an unconditional promise about solar panels and power cuts, leaving out how the system is configured.",
    "paragraphs": [
      "“Install rooftop solar and you will always have electricity during an outage,” the fictional guide says. It gives no details about the inverter, backup capability, storage, or available sunlight.",
      "Later, it says that solar paired with suitable storage can improve a home’s resilience during an outage.",
      "The difference between those two statements matters. This demonstration uses a selected Department of Energy explainer to show the missing conditions."
    ],
    "summary": "The headline leaves out important system requirements. The narrower statement about appropriately configured solar and storage is supported.",
    "takeaway": "Solar can contribute to backup power, but panels alone do not guarantee it.",
    "claims": [
      {
        "id": "guarantee",
        "text": "Rooftop solar alone guarantees electricity in every grid outage.",
        "status": "context",
        "label": "Missing important context",
        "explanation": "The selected DOE explainer says ordinary grid-dependent solar systems shut off when grid power is lost. Backup operation requires suitable system configuration.",
        "context": "Backup capability depends on the inverter, storage, controls, loads, and conditions. This demonstration does not assess any particular installation.",
        "evidence": [
          "doe-solar"
        ],
        "question": "What equipment and operating conditions does the headline leave out?"
      },
      {
        "id": "storage",
        "text": "Solar paired with appropriate storage can improve resilience.",
        "status": "supported",
        "label": "Supported by this source",
        "explanation": "DOE describes how properly configured solar and storage can provide local backup power.",
        "context": "“Can improve” is a conditional statement. It is not a guarantee of uninterrupted supply or enough power for every load.",
        "evidence": [
          "doe-solar"
        ],
        "question": "What would need to be true for this benefit to apply?"
      }
    ],
    "sources": [
      {
        "id": "doe-solar",
        "publisher": "U.S. Department of Energy",
        "title": "Solar and Resilience Basics",
        "url": "https://www.energy.gov/cmei/systems/solar-and-resilience-basics",
        "date": "Updated 18 May 2026",
        "type": "Official technical explainer",
        "note": "Relevant section: How Does Resilience Fit into the Solar Energy Landscape?",
        "limitation": "General system principles; not a technical assessment of a specific home."
      }
    ]
  },
  "buses": {
    "title": "Every bus in Riverton will be free from Monday, a viral message says",
    "topic": "Local news & shared messages",
    "url": "https://civic-wire.example/riverton-buses",
    "publisher": "Civic Wire · fictional publication",
    "lead": "A forwarded message makes a specific claim about transport prices, but includes no dated announcement or identifiable transport operator.",
    "paragraphs": [
      "“All Riverton buses will be free from Monday,” the fictional message says. It does not name the relevant Monday or provide a link to a transport authority.",
      "Riverton and this announcement are fictional. No official announcement is included in this scenario’s evidence pack.",
      "Use this case to test whether the absence of evidence is clearly communicated without turning it into a “false” verdict."
    ],
    "summary": "This evidence pack cannot establish whether the claim is true. A missing source is not proof that a claim is false.",
    "takeaway": "Do not treat this result as verification. The date, place, and original announcement still need checking.",
    "claims": [
      {
        "id": "fares",
        "text": "All Riverton buses become free from Monday.",
        "status": "uncertain",
        "label": "Insufficient evidence",
        "explanation": "The sample supplies no dated notice from an identifiable transport operator or authority.",
        "context": "Several websites repeating the same message would not necessarily be independent confirmation. In a real case, look for the original announcement and its scope.",
        "evidence": [],
        "question": "Which authority announced this, which services are covered, and what is the exact start date?"
      }
    ],
    "sources": []
  }
};
