const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "index.html");
const source = fs.readFileSync(sourcePath, "utf8");

function extractConstBlock(name) {
  const marker = `const ${name} = `;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${name}`);
  const valueStart = start + marker.length;
  const opener = source[valueStart];
  const closer = opener === "[" ? "]" : "}";
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = valueStart; i < source.length; i += 1) {
    const char = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === opener) depth += 1;
    if (char === closer) {
      depth -= 1;
      if (depth === 0) {
        return {
          start: valueStart,
          end: i + 1,
          block: source.slice(valueStart, i + 1)
        };
      }
    }
  }
  throw new Error(`Could not parse ${name}`);
}

const sectionBlock = extractConstBlock("sections");
const baseSections = new Function(`return (${sectionBlock.block});`)();

const faqLinks = [
  "WBA OpenRoaming FAQ",
  "Apple Auto-Join Behavior",
  "Apple HotSpot 2.0 Settings",
  "Android Passpoint",
  "ChromeOS Passpoint Profiles",
  "Microsoft Passpoint"
];

const styleShell = {
  "plain-language": {
    name: "Plain-Language Learner",
    shortName: "Plain Language",
    deck: "Simple wording for readers who are new to Passpoint.",
    kicker: "Writing style review",
    h1: "Passpoint in plain English.",
    lead: "A simple starting point for ANPs: what Passpoint does, why devices join automatically, which network details matter, and where to go when the team needs the exact standard or configuration detail."
  },
  "operator-playbook": {
    name: "Operator Playbook",
    shortName: "Playbook",
    deck: "Action-oriented wording for deployment and operations teams.",
    kicker: "Writing style review",
    h1: "Passpoint as an ANP deployment playbook.",
    lead: "Use this version to plan the work: define the use case, publish the right identifiers, provision client profiles, secure authentication, validate AAA, and document the support path before launch."
  },
  "wba-formal": {
    name: "Standards-Neutral WBA Formal",
    shortName: "WBA Formal",
    deck: "Formal industry-guide wording suitable for broader review.",
    kicker: "Writing style review",
    h1: "Passpoint guidance for Access Network Providers.",
    lead: "This version presents Passpoint as a standardized approach for Wi-Fi discovery, selection, secure authentication, and roaming, with references to authoritative documents for implementation-specific requirements."
  },
  executive: {
    name: "Executive Summary",
    shortName: "Executive",
    deck: "Concise business and stakeholder framing.",
    kicker: "Writing style review",
    h1: "Why Passpoint matters for managed public Wi-Fi.",
    lead: "Passpoint reduces sign-in friction, improves security, and enables scalable roaming models. This version focuses on what leaders need to understand before funding, approving, or explaining a deployment."
  },
  "support-faq": {
    name: "Support and FAQ",
    shortName: "Support",
    deck: "Helpdesk-oriented wording for support and troubleshooting teams.",
    kicker: "Writing style review",
    h1: "Passpoint support answers for real user questions.",
    lead: "This version frames each topic around what users ask, what support should check first, and where the technical team should look when auto-join, profile matching, or authentication does not behave as expected."
  },
  "comedic-plainspoken": {
    name: "Comedic Plainspoken",
    shortName: "Plainspoken",
    deck: "Informal review draft with a blunt sitcom-dad energy, without imitating any specific character.",
    kicker: "Writing style review",
    h1: "Passpoint, without the fancy fog machine.",
    lead: "This version keeps the facts intact but explains them like someone is tired of watching people click the wrong Wi-Fi network and blame the universe. It is for review, not publication."
  }
};

const content = {
  "plain-language": {
    "executive-summary": {
      summary: "Passpoint helps a device join a trusted Wi-Fi network automatically. The ANP's job is to advertise the right network information, use strong enterprise authentication, and send the login request to the right identity system.",
      meaning: [
        "Passpoint is the Wi-Fi Alliance name for Hotspot 2.0 features that help devices find, choose, and join trusted Wi-Fi networks.",
        "The user should not have to open a splash page or type the same password again and again.",
        "The ANP controls the network information, security settings, AAA routing, accounting records, and support data that make the experience work."
      ],
      decisions: [
        "Start by deciding who the service is for: subscribers, roaming partners, enterprise users, venue guests, or carrier offload.",
        "Make sure the network identifiers match the profiles and credentials users will have on their devices.",
        "Use this guide for orientation, then use Wi-Fi Alliance, IEEE, IETF, WBA, and vendor documents for exact rules."
      ],
      note: "Most problems show up later because something was wrong before the device joined: the profile, network identifiers, or AAA route did not line up."
    },
    "evolution": {
      summary: "Older hotspot systems often depended on a web page. Passpoint moves the decision into Wi-Fi discovery and enterprise authentication, which makes the experience more automatic and more reliable.",
      meaning: [
        "WISPr and captive portal flows asked the browser to handle the sign-in step.",
        "Hotspot 2.0 added ways for a device to ask the network for details before it joins.",
        "Passpoint combines that discovery with WPA-Enterprise and EAP so the device can join a trusted network without a web login."
      ],
      decisions: [
        "Do not design Passpoint like a nicer splash page. It is a profile and authentication workflow.",
        "Plan the identity path first, then configure the AP and ANQP values to match it.",
        "Keep a normal guest SSID only when you need one for users who do not have a Passpoint profile."
      ],
      note: "Simple rule: captive portals ask the user to prove something after connecting; Passpoint lets the device prove it belongs before the normal session starts."
    },
    "standards": {
      summary: "Passpoint has evolved over multiple releases. R1 covers the core join process, R2 adds sign-up and profile update ideas, and R3 adds richer network information and newer security options.",
      meaning: [
        "R1 is the basic foundation: discovery, network selection, and WPA2-Enterprise authentication.",
        "R2 introduced Online Sign-Up and ways to update or fix subscription profiles.",
        "R3 added more operator and venue information and support for stronger WPA3-Enterprise options."
      ],
      decisions: [
        "Confirm what your APs, controllers, identity systems, and target client devices support.",
        "Use practical profile delivery methods such as MDM, carrier bundles, apps, or OS profile install when they are more reliable than OSU.",
        "Separate certification release language from the names vendors use in their configuration screens."
      ],
      note: "For many ANPs, the real question is not whether every OSU setting is enabled. It is how the right profile gets onto the device and stays current."
    },
    "connection-process": {
      summary: "A Passpoint connection happens in steps. The network advertises a hint, the device asks for more information, the profile is checked, and then enterprise Wi-Fi authentication completes the join.",
      meaning: [
        "The beacon can show that the network supports Hotspot 2.0 and may include a small amount of roaming information.",
        "The device uses ANQP to ask for details such as domains, realms, roaming consortium IDs, venue information, and WAN hints.",
        "If the profile matches and the signal is usable, the device starts WPA-Enterprise and EAP authentication."
      ],
      decisions: [
        "Keep the beacon information short and put the full detail in ANQP.",
        "Test ANQP responses before launch so missing metadata is not mistaken for a client bug.",
        "Make sure the EAP methods and RADIUS settings match what the network advertises."
      ],
      note: "Troubleshooting is easier when the team checks each step separately: beacon, ANQP, profile match, EAP, RADIUS, and accounting."
    },
    identifiers: {
      summary: "Passpoint matching depends on several identifiers. Domain names, NAI realms, RCOIs, and PLMN values each tell the device something different.",
      meaning: [
        "The domain name usually identifies the operator or home service provider.",
        "The NAI realm tells the device which authentication realms and EAP methods are supported.",
        "RCOI and PLMN values help with roaming federation and carrier offload use cases."
      ],
      decisions: [
        "Advertise home and roaming identifiers when both use cases apply.",
        "List the correct EAP method for each realm so the match does not fail later.",
        "Set venue, WAN, internet availability, and IP capability information accurately because some clients use those hints."
      ],
      note: "Think of ANQP as a promise. If the network says it supports something, the AAA path and policy need to support it too."
    },
    "client-profiles": {
      summary: "A device needs a Passpoint profile before the automatic experience works. The profile tells the device what to match and which credential to use.",
      meaning: [
        "Profiles can come from a carrier, MDM, app, web download, OS install flow, or device management system.",
        "A profile can include domains, realms, RCOIs, PLMN values, EAP methods, certificates, SIM credential use, names, and priority hints.",
        "Different operating systems may handle priority, roaming, display names, and managed networks differently."
      ],
      decisions: [
        "Document how each device type receives and updates the profile.",
        "Test home matches, roaming matches, and no-match cases so support knows what users will see.",
        "Do not make manual network selection the main workflow. The value is automatic joining after profile install."
      ],
      note: "A good network configuration cannot help a device that never received the right profile."
    },
    "wireless-security": {
      summary: "Passpoint should be treated like enterprise Wi-Fi. It should use strong authentication, encrypted Wi-Fi access, and deliberate roaming and management-frame settings.",
      meaning: [
        "The common baseline is WPA2-Enterprise with AES/CCMP and 802.1X/EAP.",
        "WPA3-Enterprise and Protected Management Frames may be needed depending on bands, client support, and policy.",
        "Fast roaming can reduce repeated full authentications as users move between APs."
      ],
      decisions: [
        "Choose EAP methods based on the credential type: certificate, username/password, or SIM-based identity.",
        "Protect AAA systems from bad-credential loops and repeated failed authentication attempts.",
        "Review client isolation and local forwarding policy instead of assuming encryption solves every exposure."
      ],
      note: "Passpoint can be easy for the user and still secure, but only if the enterprise Wi-Fi controls are configured correctly."
    },
    "aaa-radsec": {
      summary: "AAA is the back-end service path for Passpoint. It handles authentication, routing, accounting, and the operational data needed to support the service.",
      meaning: [
        "RADIUS over UDP should not cross untrusted networks without protection.",
        "RadSec uses TLS to protect RADIUS traffic and is common for roaming and OpenRoaming connections.",
        "Accounting, NAS identifiers, Called-Station-ID, and location attributes help teams trace and support sessions."
      ],
      decisions: [
        "Use RadSec or another protected path when RADIUS leaves a trusted network.",
        "Align DNS, PKI, certificates, and trust anchors before relying on dynamic peer discovery.",
        "Standardize accounting and location values so support can trace users, venues, APs, and roaming paths."
      ],
      note: "If the user can connect but the operator cannot explain where the session went, how it was routed, or how long it lasted, the service is not ready to scale."
    },
    "deployment-patterns": {
      summary: "A good Passpoint deployment starts with a clear use case. Then the ANP chooses the smallest complete set of features needed for automatic, secure, supportable service.",
      meaning: [
        "Plain 802.1X can be fine for managed enterprise users, but it does not provide the same discovery and roaming metadata.",
        "Passpoint without useful ANQP misses much of the value.",
        "OpenRoaming adds federation policy, common RCOIs, PKI expectations, and scalable roaming relationships."
      ],
      decisions: [
        "Choose the target model: enterprise onboarding, carrier offload, venue roaming, OpenRoaming, or partner roaming.",
        "Build a launch checklist that covers identifiers, ANQP, profiles, security, AAA, RadSec, accounting, location, monitoring, and rollback.",
        "Test with each target OS and credential type before calling the service ready."
      ],
      note: "The best first launch is narrow enough to test and complete enough that every required field has an owner."
    },
    faq: {
      summary: "Most Passpoint support questions come from the same misunderstanding: users expect to click a network, but Passpoint is supposed to work from a trusted profile.",
      meaning: [
        "A visible Passpoint network is not always meant to be clicked like a normal guest SSID.",
        "The device needs a profile and credential that match the network before automatic join can work.",
        "Support should explain the expected behavior first, then check the technical chain."
      ],
      decisions: [
        "Ask whether the profile is installed before troubleshooting the AP.",
        "Check profile, ANQP, identifier match, EAP method, certificates, and AAA routing in order.",
        "Document who owns profile updates and removal for carrier, MDM, app, or OpenRoaming deployments."
      ],
      note: "Short support answer: Passpoint is meant to be automatic when the device has the right profile.",
      faqItems: [
        ["I clicked the Passpoint network and it did not work. Why?", "Usually, you are not supposed to click it. The device needs a matching Passpoint profile and credential, then it joins automatically."],
        ["Is Passpoint secure?", "It is designed to be more secure than open guest Wi-Fi because it uses enterprise authentication and encrypted Wi-Fi access. The setup still has to be configured correctly."],
        ["Why did my carrier auto-join me to Wi-Fi?", "Your carrier or partner may have installed a Passpoint profile. If the network matches that profile, the device can join automatically."],
        ["Why can't I forget or remove this network?", "It may be managed by a carrier, app, or MDM policy. The removal path may be the profile or management system, not the visible Wi-Fi row."],
        ["Do I need a username or password?", "Sometimes. Some profiles use username and password, some use certificates, and some use SIM-based credentials."],
        ["Is Passpoint the same as OpenRoaming?", "No. Passpoint is the Wi-Fi technology. OpenRoaming is a WBA federation model that uses Passpoint with additional policy and trust rules."],
        ["Why does it work on one phone but not another?", "Profiles, OS version, carrier policy, EAP support, certificates, and roaming priority can all differ by device."],
        ["Why did my device choose Wi-Fi instead of cellular?", "The device may prefer a trusted Wi-Fi network when the profile, policy, and network quality make Wi-Fi the better path."],
        ["Can the ANP or carrier see my traffic?", "Passpoint protects the Wi-Fi link. It does not replace HTTPS, VPNs, or other application-layer privacy protections."],
        ["Does Passpoint replace captive portals?", "For the Passpoint experience, yes. A venue may still run a separate guest SSID for users without profiles."]
      ]
    },
    "resources-detail": {
      summary: "This guide should stay short and point readers to the right source documents for exact rules and implementation details.",
      meaning: [
        "Use Wi-Fi Alliance resources for Passpoint positioning and certification context.",
        "Use IEEE and IETF documents for the underlying protocol details.",
        "Use WBA and OpenRoaming resources for federation, onboarding, PKI, and operational guidance."
      ],
      decisions: [
        "Group links by task so readers can find the right reference quickly.",
        "Keep vendor-specific configuration guides as implementation appendices.",
        "Review links before publication because some documents may require login or membership access."
      ],
      note: "The resource shelf keeps the guide readable while still giving technical readers a path to the full details."
    }
  }
};

content["operator-playbook"] = {
  "executive-summary": {
    summary: "Deploy Passpoint by lining up four things: advertised metadata, client profiles, enterprise authentication, and AAA routing. If those pieces agree, the user gets automatic secure Wi-Fi instead of a portal workflow.",
    meaning: ["Treat Passpoint as an operational service, not a guest SSID feature.", "The client decides to join before association by comparing network metadata with its installed profile.", "The ANP owns the network-side contract: identifiers, ANQP, security, AAA, accounting, and support data."],
    decisions: ["Define the served populations and roaming relationships before configuring fields.", "Build a mapping table for domain, realm, RCOI, PLMN, EAP method, and AAA route.", "Use standards and vendor docs for exact syntax after the operating model is clear."],
    note: "Launch risk drops when metadata, profiles, and AAA routing are validated together."
  },
  "evolution": {
    summary: "Move the design away from captive-portal thinking. Passpoint shifts selection and authentication into Wi-Fi discovery, profile matching, and 802.1X.",
    meaning: ["WISPr and UAM relied on browser automation and portal logic.", "Hotspot 2.0 provides pre-association discovery through GAS and ANQP.", "Passpoint adds the profile and enterprise authentication model needed for automatic joining."],
    decisions: ["Do not put a captive portal in the critical path of the Passpoint SSID.", "Define the credential and identity route before AP configuration begins.", "Keep legacy guest access separate when it is still required."],
    note: "If the browser is the primary authentication tool, the design is not using Passpoint's main value."
  },
  "standards": {
    summary: "Use release language to understand capabilities, then verify what your actual clients and infrastructure support.",
    meaning: ["R1 covers core discovery, selection, and WPA2-Enterprise.", "R2 adds Online Sign-Up and remediation workflows.", "R3 adds richer operator/venue signaling and newer security options."],
    decisions: ["Record supported Passpoint release features for APs, controllers, and target clients.", "Choose the profile delivery method that is reliable for your user population.", "Translate vendor labels back to standards terms during design review."],
    note: "The deployment plan should say which release capabilities are required and which are out of scope."
  },
  "connection-process": {
    summary: "Validate the join path one stage at a time: beacon, ANQP, profile match, WPA-Enterprise, EAP, AAA, and accounting.",
    meaning: ["The beacon advertises Hotspot 2.0 support and limited roaming hints.", "ANQP supplies the detailed metadata clients need before association.", "A matching profile triggers enterprise authentication and key establishment."],
    decisions: ["Keep beacon RCOIs limited and publish the full list through ANQP.", "Capture ANQP responses during acceptance testing.", "Confirm advertised realms and EAP methods match RADIUS policy."],
    note: "A clean test plan isolates each step so failures do not become generic client complaints."
  },
  identifiers: {
    summary: "Build an identifier matrix. Domain, NAI realm, RCOI, and PLMN each serve a different matching and routing purpose.",
    meaning: ["Domain supports home-provider matching.", "NAI realm connects client profile matching to authentication routing.", "RCOI and PLMN support federation, OpenRoaming, and carrier offload scenarios."],
    decisions: ["Publish all required home and roaming identifiers.", "Tie each realm to supported EAP methods.", "Set venue, WAN, internet, and IP capability values from the actual service design."],
    note: "ANQP values must match the AAA route and business relationship they advertise."
  },
  "client-profiles": {
    summary: "Profile distribution is a deployment workstream. Without a profile on the device, the SSID can be configured perfectly and still not auto-join.",
    meaning: ["Profiles can be delivered by carrier, MDM, app, web flow, OS profile, or device policy.", "Profiles carry matching rules, credentials, names, and priority hints.", "Client operating systems differ in how they expose managed networks and auto-join behavior."],
    decisions: ["Document profile delivery and update paths per platform.", "Test home, roaming, expired, and no-profile cases.", "Create support notes for profile removal or replacement."],
    note: "Own the profile lifecycle with the same discipline as the AP configuration."
  },
  "wireless-security": {
    summary: "Set security policy as enterprise Wi-Fi policy. Choose EAP methods, certificate trust, roaming behavior, and client protections deliberately.",
    meaning: ["WPA2-Enterprise with AES/CCMP and 802.1X/EAP is the common baseline.", "WPA3-Enterprise and PMF requirements depend on bands, devices, and policy.", "Fast roaming can improve experience and reduce AAA load."],
    decisions: ["Map credential types to EAP methods.", "Protect AAA from bad credentials and retry loops.", "Review client isolation, local bridging, and peer-to-peer policy."],
    note: "Automatic join should not mean relaxed security controls."
  },
  "aaa-radsec": {
    summary: "Design AAA for secure transport, reliable routing, accounting, and traceability before production launch.",
    meaning: ["Classic RADIUS needs protection outside trusted boundaries.", "RadSec provides TLS protection and is common for roaming interconnects.", "Accounting and location attributes make sessions supportable."],
    decisions: ["Use RadSec or protected transport for external AAA paths.", "Validate DNS, PKI, trust anchors, and certificates.", "Standardize NAS-ID, Called-Station-ID, interim accounting, and location formatting."],
    note: "Authentication success is not enough if operations cannot trace the session."
  },
  "deployment-patterns": {
    summary: "Select the deployment pattern, then configure the minimum complete feature set for that pattern.",
    meaning: ["Managed enterprise 802.1X may not need Passpoint.", "Passpoint adds discovery and roaming metadata beyond secure association.", "OpenRoaming adds federation rules, PKI, and scalable partner relationships."],
    decisions: ["Pick the target pattern and document what is in scope.", "Run a launch checklist across identifiers, profiles, security, AAA, accounting, monitoring, and rollback.", "Test with representative devices and credential types."],
    note: "A smaller complete deployment beats a broad half-configured one."
  },
  faq: {
    summary: "Turn common user confusion into a support workflow: set expectations, confirm the profile, then troubleshoot the technical chain.",
    meaning: ["Users may see a network name and think manual selection is required.", "Support needs to know whether the profile is user-installed, carrier-managed, or MDM-managed.", "Escalation should follow the join path from profile to AAA."],
    decisions: ["Start every ticket by checking profile presence and ownership.", "Escalate with ANQP capture, EAP result, RADIUS result, and device OS details.", "Keep carrier, MDM, and OpenRoaming ownership clear."],
    note: "The first fix may be expectation-setting, not controller configuration.",
    faqItems: [
      ["I clicked the Passpoint network and it did not work. Why?", "Check whether the device has the required profile. Manual selection is not the primary workflow for many Passpoint deployments."],
      ["Is Passpoint secure?", "It can be secure when WPA-Enterprise, EAP, certificates, and AAA policy are configured correctly."],
      ["Why did my carrier auto-join me to Wi-Fi?", "The carrier likely provisioned a profile that matched an approved network."],
      ["Why can't I forget or remove this network?", "The profile may be managed by carrier policy, MDM, or an app. Remove or update it at the profile owner."],
      ["Do I need a username or password?", "Only for credential types that require one. Certificates and SIM credentials may not prompt the user."],
      ["Is Passpoint the same as OpenRoaming?", "No. OpenRoaming is a federation model that uses Passpoint as part of the access method."],
      ["Why does it work on one phone but not another?", "Compare profile status, OS version, EAP support, certificate trust, and carrier policy."],
      ["Why did my device choose Wi-Fi instead of cellular?", "The device followed profile, OS, and carrier policy based on network match and quality."],
      ["Can the ANP or carrier see my traffic?", "They can see operational metadata and may see destinations unless higher-layer encryption protects them."],
      ["Does Passpoint replace captive portals?", "For profiled users, yes. Keep a separate portal SSID only for non-profile users."]
    ]
  },
  "resources-detail": {
    summary: "Use the guide as the map and the reference shelf as the source of authority.",
    meaning: ["Wi-Fi Alliance materials explain certification context.", "IEEE and IETF documents define protocol behavior.", "WBA and OpenRoaming materials explain federation and operational onboarding."],
    decisions: ["Group resources by task.", "Keep vendor-specific implementation steps outside the primer.", "Review member-only or login-gated links before publication."],
    note: "A short guide works when every deep-dive path is easy to find."
  }
};

content["wba-formal"] = {
  "executive-summary": {
    summary: "Passpoint provides a standardized framework for Wi-Fi network discovery, selection, authentication, and roaming. The ANP is responsible for publishing accurate discovery metadata, enforcing enterprise-grade security, and routing authentication to the appropriate identity provider.",
    meaning: ["Passpoint is the Wi-Fi Alliance certification program for Hotspot 2.0 capabilities.", "The intended user experience is automatic network selection and authentication using a provisioned profile.", "ANPs manage the network-side information, security posture, AAA routing, accounting, and operational visibility."],
    decisions: ["Identify the service populations and roaming relationships supported by the deployment.", "Ensure advertised identifiers align with provisioned credentials and authentication routes.", "Consult normative standards and program documents for definitive requirements."],
    note: "Successful deployments depend on consistency between published metadata, client profiles, and authentication infrastructure."
  },
  "evolution": {
    summary: "Passpoint replaces portal-centric hotspot access with standards-based discovery and enterprise authentication at the Wi-Fi layer.",
    meaning: ["Legacy WISPr and UAM models depended on browser-based captive portal interaction.", "IEEE 802.11u introduced interworking mechanisms, including GAS and ANQP.", "Passpoint combines these discovery mechanisms with WPA-Enterprise authentication."],
    decisions: ["Avoid conflating Passpoint with captive portal automation.", "Align identity, profile, and ANQP design before production configuration.", "Use separate guest access where non-profiled access remains required."],
    note: "The architectural shift is from post-association web authentication to pre-association network selection and credential-based access."
  },
  "standards": {
    summary: "Passpoint release capabilities should be interpreted in relation to actual infrastructure and client support.",
    meaning: ["Release 1 defines core discovery, selection, and WPA2-Enterprise authentication capabilities.", "Release 2 adds Online Sign-Up and remediation concepts.", "Release 3 extends operator and venue signaling and adds support for newer security capabilities."],
    decisions: ["Document supported release capabilities across APs, controllers, and client platforms.", "Select practical profile provisioning methods for the target user population.", "Distinguish standards terminology from vendor-specific configuration labels."],
    note: "Release support should be treated as an implementation constraint and verified through testing."
  },
  "connection-process": {
    summary: "The Passpoint connection process proceeds through advertised capability, ANQP discovery, profile matching, secure association, and AAA authentication.",
    meaning: ["Beacon information indicates Hotspot 2.0 capability and limited roaming consortium data.", "ANQP provides detailed network metadata prior to association.", "A matching profile allows the client to proceed with WPA-Enterprise and EAP authentication."],
    decisions: ["Use beacon fields selectively and publish complete metadata through ANQP.", "Validate ANQP responses during acceptance testing.", "Ensure advertised authentication methods correspond to AAA policy."],
    note: "Operational troubleshooting should preserve visibility into each stage of the connection process."
  },
  identifiers: {
    summary: "Domain names, NAI realms, RCOIs, and PLMN values are distinct identifiers that support different matching and routing scenarios.",
    meaning: ["Domain names support operator or home service provider identification.", "NAI realms identify supported authentication realms and methods.", "RCOIs and PLMN values support federation, roaming, and carrier offload use cases."],
    decisions: ["Publish identifiers required for both home and roaming scenarios.", "Associate each realm with the correct EAP method.", "Configure venue, WAN, internet, and IP capability information accurately."],
    note: "Discovery metadata should accurately represent the authentication and roaming services actually available."
  },
  "client-profiles": {
    summary: "Client profiles are required for Passpoint matching and credential use. Provisioning and lifecycle management should be planned as part of deployment.",
    meaning: ["Profiles may be distributed through carrier, MDM, application, web, or OS-supported mechanisms.", "Profiles include matching identifiers, credentials, EAP methods, trust settings, display names, and priority hints.", "Client behavior varies across operating systems and policy environments."],
    decisions: ["Define profile delivery and update mechanisms for each target platform.", "Test expected match and no-match scenarios.", "Document profile ownership and removal procedures."],
    note: "Network configuration and profile provisioning must be managed together."
  },
  "wireless-security": {
    summary: "Passpoint deployments should apply enterprise Wi-Fi security principles, including robust EAP design, appropriate WPA policy, and management-frame protection where required.",
    meaning: ["WPA2-Enterprise with AES/CCMP and 802.1X/EAP is a common baseline.", "WPA3-Enterprise and Protected Management Frames may be required depending on policy and spectrum band.", "Fast roaming can improve mobility performance and reduce authentication load."],
    decisions: ["Select EAP methods according to credential type and identity source.", "Protect AAA infrastructure from repeated authentication failures.", "Review isolation and local forwarding policies."],
    note: "A simplified user experience should not reduce the security requirements applied to the access service."
  },
  "aaa-radsec": {
    summary: "AAA design is central to Passpoint operations, particularly for secure transport, routing, accounting, and supportability.",
    meaning: ["RADIUS traffic should be protected when it crosses untrusted boundaries.", "RadSec provides TLS protection for RADIUS and is widely used for roaming interconnection.", "Accounting and location attributes support troubleshooting, reporting, and policy enforcement."],
    decisions: ["Use protected AAA transport for external or roaming paths.", "Validate DNS, PKI, certificates, and trust anchors for dynamic discovery.", "Standardize accounting and location attributes for operational visibility."],
    note: "A scalable service requires both successful authentication and reliable operational traceability."
  },
  "deployment-patterns": {
    summary: "Deployment design should begin with the target use case and then select the Passpoint capabilities required to support it.",
    meaning: ["Traditional 802.1X may meet some managed enterprise requirements without Passpoint.", "Passpoint adds discovery and roaming metadata to the secure access model.", "OpenRoaming adds federation policies, PKI requirements, and standardized roaming relationships."],
    decisions: ["Define the deployment model and scope.", "Create a validation checklist across identifiers, profiles, security, AAA, accounting, and monitoring.", "Verify behavior across representative client platforms and credential types."],
    note: "A constrained deployment with complete validation is preferable to an overly broad initial scope."
  },
  faq: {
    summary: "FAQ content should clarify expected Passpoint behavior, profile ownership, and support escalation paths.",
    meaning: ["Passpoint networks may be visible to users but are primarily profile-driven.", "Automatic joining depends on provisioned credentials and matching metadata.", "Support teams should distinguish user expectation issues from technical failures."],
    decisions: ["Confirm profile presence and ownership before network troubleshooting.", "Use a structured escalation path from client profile to ANQP to AAA.", "Avoid overstating privacy guarantees beyond Wi-Fi link protection."],
    note: "The recommended support framing is that Passpoint operates automatically when the device has an appropriate profile.",
    faqItems: [
      ["I clicked the Passpoint network and it did not work. Why?", "Manual selection may not be the intended access method. The device normally requires a matching Passpoint profile and credential."],
      ["Is Passpoint secure?", "Passpoint uses enterprise Wi-Fi authentication and encrypted access, subject to correct configuration and credential policy."],
      ["Why did my carrier auto-join me to Wi-Fi?", "A carrier-managed Passpoint profile may authorize automatic joining to approved partner networks."],
      ["Why can't I forget or remove this network?", "The network may be controlled by a managed profile or carrier policy rather than a user-created Wi-Fi entry."],
      ["Do I need a username or password?", "That depends on the credential type. Some deployments use passwords, while others use certificates or SIM-based credentials."],
      ["Is Passpoint the same as OpenRoaming?", "No. OpenRoaming is a WBA federation framework that uses Passpoint capabilities."],
      ["Why does it work on one phone but not another?", "Client platform, OS version, profile content, EAP support, and policy can differ."],
      ["Why did my device choose Wi-Fi instead of cellular?", "The device may prefer a trusted Wi-Fi profile based on OS, carrier, policy, and network-quality decisions."],
      ["Can the ANP or carrier see my traffic?", "Passpoint protects Wi-Fi access but does not replace end-to-end application encryption or VPN protections."],
      ["Does Passpoint replace captive portals?", "For profiled Passpoint users, it is intended to remove the captive portal workflow."]
    ]
  },
  "resources-detail": {
    summary: "Readers should be directed to authoritative sources for normative language, certification requirements, and detailed implementation guidance.",
    meaning: ["Wi-Fi Alliance resources provide certification and program context.", "IEEE and IETF documents define underlying technical mechanisms.", "WBA and OpenRoaming resources address federation and operational onboarding."],
    decisions: ["Organize resources by reader task.", "Separate vendor configuration material from primer content.", "Confirm availability of member-only or login-protected resources before publication."],
    note: "The guide should remain concise while preserving a clear path to authoritative references."
  }
};

content.executive = {
  "executive-summary": {
    summary: "Passpoint makes public Wi-Fi feel more like cellular access: trusted devices connect automatically and securely. For ANPs, the business value is less user friction, better security, and a foundation for roaming partnerships.",
    meaning: ["Passpoint reduces dependence on captive portals and repeated manual sign-in.", "It enables managed access for subscribers, partners, enterprises, venues, and carriers.", "The ANP must operate the discovery, security, authentication, and reporting pieces as one service."],
    decisions: ["Confirm the target business model before selecting features.", "Make profile delivery and AAA routing part of the launch plan.", "Use standards and vendor documents for implementation-level decisions."],
    note: "The value is not one setting. It is a coordinated service experience."
  },
  "evolution": {
    summary: "The industry moved from portal-driven guest Wi-Fi toward automatic, secure, profile-driven access.",
    meaning: ["Captive portals create friction and break easily when user experience changes.", "Passpoint moves the decision earlier in the connection process.", "The result can be a more reliable experience for users and roaming partners."],
    decisions: ["Use Passpoint where automatic trusted access matters.", "Keep legacy guest access separate when needed.", "Do not position Passpoint as a portal redesign."],
    note: "The strategic shift is from asking users to log in to letting trusted devices connect."
  },
  "standards": {
    summary: "Passpoint release levels matter because they define available capabilities, but deployment success depends on supported devices and operational design.",
    meaning: ["R1 establishes the core model.", "R2 adds sign-up and remediation concepts.", "R3 adds additional signaling and newer security capabilities."],
    decisions: ["Align required features with device and infrastructure support.", "Select a profile delivery model users can actually receive.", "Avoid over-scoping the first release."],
    note: "Leadership should ask which capabilities are required for the use case, not which checkbox sounds newest."
  },
  "connection-process": {
    summary: "Passpoint works because the device can evaluate the network before the user experience starts.",
    meaning: ["The network advertises capability.", "The device requests more detail.", "A matching profile leads to secure enterprise authentication."],
    decisions: ["Budget time for validation of each step.", "Require ANQP testing in acceptance criteria.", "Connect user experience metrics to authentication and AAA logs."],
    note: "Automatic does not mean invisible to operations; it means the workflow should be observable without user effort."
  },
  identifiers: {
    summary: "Identifiers are the business and technical signals that tell devices which networks and roaming relationships apply.",
    meaning: ["Domain and realm values support identity and authentication decisions.", "RCOI values support federation and roaming models.", "PLMN values support carrier offload scenarios."],
    decisions: ["Approve the identifier strategy before launch.", "Tie identifiers to partner agreements and routing policy.", "Maintain accurate venue and network capability data."],
    note: "Bad identifiers create failed joins and partner confusion."
  },
  "client-profiles": {
    summary: "Profile distribution is the user adoption mechanism. Without it, Passpoint capability on the network does not translate into automatic connections.",
    meaning: ["Profiles tell devices when to trust and join the network.", "Carriers, enterprises, apps, MDM systems, or OS flows may distribute profiles.", "Platform behavior varies and must be tested."],
    decisions: ["Assign ownership for profile creation, delivery, update, and removal.", "Test priority and roaming behavior on major platforms.", "Prepare support guidance for managed profiles."],
    note: "The deployment is only as good as the profile reach."
  },
  "wireless-security": {
    summary: "Passpoint should improve convenience without weakening enterprise Wi-Fi security.",
    meaning: ["It uses WPA-Enterprise and EAP rather than open access.", "Stronger WPA3 and management-frame requirements may apply by band and policy.", "Roaming performance depends on fast and reliable authentication."],
    decisions: ["Approve credential and EAP strategy.", "Set expectations for privacy and operational visibility.", "Protect AAA systems and client isolation policy."],
    note: "The right executive message is secure automatic access, not open automatic access."
  },
  "aaa-radsec": {
    summary: "AAA is the operating backbone of Passpoint. It determines whether roaming and partner access can scale reliably.",
    meaning: ["Authentication must route to the right identity provider.", "External RADIUS paths need protection such as RadSec.", "Accounting and location data support reporting, support, and compliance needs."],
    decisions: ["Fund secure AAA transport and certificate management.", "Require reporting and support data as launch criteria.", "Make operational traceability part of partner readiness."],
    note: "A service that cannot be traced cannot be managed at scale."
  },
  "deployment-patterns": {
    summary: "The best first deployment is focused, measurable, and supportable.",
    meaning: ["Different use cases require different Passpoint feature sets.", "OpenRoaming adds federation responsibilities beyond local access.", "A smaller validated rollout builds confidence faster."],
    decisions: ["Pick one primary use case for the first release.", "Define success metrics and rollback criteria.", "Test with actual devices and credentials before expansion."],
    note: "Start with a service the organization can explain and operate."
  },
  faq: {
    summary: "FAQ content protects the launch by reducing confusion about automatic joining, managed profiles, and security expectations.",
    meaning: ["Users may not understand why Wi-Fi connected automatically.", "Support teams need simple answers before deep troubleshooting.", "Clear messaging reduces false escalations."],
    decisions: ["Prepare end-user language before launch.", "Document who owns managed profiles.", "Explain security accurately without overpromising privacy."],
    note: "The FAQ is part of launch readiness, not an afterthought.",
    faqItems: [
      ["I clicked the Passpoint network and it did not work. Why?", "The service is designed around automatic profile matching, not manual selection."],
      ["Is Passpoint secure?", "It uses enterprise Wi-Fi security when configured correctly."],
      ["Why did my carrier auto-join me to Wi-Fi?", "Your carrier may have authorized the network through a managed profile."],
      ["Why can't I forget or remove this network?", "The profile may be managed by carrier or enterprise policy."],
      ["Do I need a username or password?", "Only some credential models require one."],
      ["Is Passpoint the same as OpenRoaming?", "No. OpenRoaming is a federation framework that builds on Passpoint."],
      ["Why does it work on one phone but not another?", "Device policy, profile status, and OS support can vary."],
      ["Why did my device choose Wi-Fi instead of cellular?", "The device followed trusted-network policy and connection quality signals."],
      ["Can the ANP or carrier see my traffic?", "They may see operational metadata; application privacy still depends on higher-layer encryption."],
      ["Does Passpoint replace captive portals?", "For profiled users, that is the goal."]
    ]
  },
  "resources-detail": {
    summary: "The guide should remain short enough for decision-making and point technical teams to authoritative sources.",
    meaning: ["Program and certification context belongs with Wi-Fi Alliance.", "Protocol depth belongs with IEEE and IETF.", "Federation and OpenRoaming guidance belongs with WBA resources."],
    decisions: ["Use the resource shelf to keep the main guide concise.", "Keep vendor instructions out of the executive layer.", "Review links before formal circulation."],
    note: "A good executive guide tells people what matters and where the experts should go next."
  }
};

content["support-faq"] = {
  "executive-summary": {
    summary: "When Passpoint works, users should not need a portal or repeated password prompt. If it does not work, support should first check whether the device has a valid profile and whether the network metadata matches that profile.",
    meaning: ["Passpoint is automatic only after the device has the right profile.", "The network must advertise identifiers the profile can recognize.", "AAA must accept and route the authentication request correctly."],
    decisions: ["Ask who owns the user credential.", "Check the installed profile before changing WLAN settings.", "Use logs from client, AP/controller, and AAA to confirm the failure point."],
    note: "Most tickets start as 'Wi-Fi did not work' but resolve to profile, match, or AAA issues."
  },
  "evolution": {
    summary: "Do not troubleshoot Passpoint like a captive portal. The expected workflow is profile match first, enterprise authentication second, web browser not required.",
    meaning: ["Old hotspot flows often depended on browser redirects.", "Passpoint clients ask the network for metadata before joining.", "The device decides based on profile and credential match."],
    decisions: ["Do not send users to a splash page for the Passpoint SSID.", "Check ANQP and profile match when users say clicking did nothing.", "Use the guest SSID for users who do not have a profile."],
    note: "If support is asking users to click around, the support script probably needs work."
  },
  "standards": {
    summary: "Different devices and vendors may support different Passpoint capabilities. Support scripts need to account for that variation.",
    meaning: ["R1, R2, and R3 describe different capability sets.", "OSU-related settings may appear even when the deployment does not use OSU.", "Client platform behavior varies."],
    decisions: ["Record supported client OS versions.", "Keep platform-specific profile instructions available.", "Escalate release-capability questions to the engineering owner."],
    note: "Do not assume a setting name means the same thing across vendors."
  },
  "connection-process": {
    summary: "For failed auto-join, walk the connection path: profile, beacon, ANQP, match, EAP, RADIUS, policy, and accounting.",
    meaning: ["Beacon tells the client the network may be relevant.", "ANQP provides the details needed for matching.", "EAP and AAA decide whether access is allowed."],
    decisions: ["Collect client OS, profile source, SSID/BSSID, time, and venue.", "Capture ANQP and RADIUS evidence for escalations.", "Separate no-match failures from authentication failures."],
    note: "The phrase 'it does not connect' is not enough. Identify the stage."
  },
  identifiers: {
    summary: "If identifiers are wrong, the device may ignore the network or choose it and fail later.",
    meaning: ["Domain, realm, RCOI, and PLMN are not interchangeable.", "The client uses them to decide whether the profile applies.", "AAA uses realm information to route the request."],
    decisions: ["Compare the profile identifiers to the advertised ANQP response.", "Check EAP method mapping for the realm.", "Confirm venue and WAN values are not misleading clients."],
    note: "Bad metadata can look like a client bug."
  },
  "client-profiles": {
    summary: "The profile is the first support checkpoint. No profile, wrong profile, expired profile, or managed profile policy can all explain user reports.",
    meaning: ["Profiles may be installed by carrier, app, MDM, web, or OS tools.", "Users may not know a managed profile exists.", "Removal or update may require the profile owner."],
    decisions: ["Ask how the profile was installed.", "Check whether auto-join is enabled and whether the profile is still valid.", "Document profile removal and replacement steps by platform."],
    note: "A perfect AP configuration cannot fix a missing profile."
  },
  "wireless-security": {
    summary: "Authentication failures often come from EAP, certificate, policy, or credential problems.",
    meaning: ["Passpoint normally uses WPA-Enterprise and EAP.", "Certificate trust and EAP method support must match the profile.", "Bad-credential loops can create load and confusing user behavior."],
    decisions: ["Check EAP result codes and certificate chain errors.", "Throttle repeated failures where appropriate.", "Confirm WPA2/WPA3 and PMF settings are compatible with target clients."],
    note: "Security settings should be tested with real client profiles, not just controller defaults."
  },
  "aaa-radsec": {
    summary: "If matching succeeds but login fails, support needs AAA evidence.",
    meaning: ["RadSec may protect roaming RADIUS paths.", "Dynamic discovery depends on DNS and certificate trust.", "Accounting and location attributes help trace sessions."],
    decisions: ["Capture Access-Request, response, realm, NAS-ID, Called-Station-ID, and error reason.", "Check RadSec certificate and trust failures.", "Confirm interim accounting requirements."],
    note: "AAA logs often answer the question faster than another client retry."
  },
  "deployment-patterns": {
    summary: "Support readiness should be part of deployment readiness.",
    meaning: ["Different deployment models create different support paths.", "OpenRoaming adds federation and partner escalation points.", "User-visible behavior should be documented before launch."],
    decisions: ["Create support scripts for each user population.", "Test with target OS and credential types.", "Define escalation paths for carrier, MDM, IdP, hub, and ANP teams."],
    note: "A deployment is not complete until support can explain expected behavior."
  },
  faq: {
    summary: "Use the FAQ as the first response layer for common user reports.",
    meaning: ["Start with expected behavior.", "Move to profile ownership.", "Escalate only with useful technical evidence."],
    decisions: ["Keep answers short and consistent.", "Maintain platform-specific support notes.", "Review privacy and security language with policy owners."],
    note: "Good FAQ answers prevent unnecessary escalations.",
    faqItems: [
      ["I clicked the Passpoint network and it did not work. Why?", "Do not start by clicking it. First confirm that a Passpoint profile is installed and allowed to auto-join."],
      ["Is Passpoint secure?", "It uses enterprise Wi-Fi security, but the deployment must validate EAP, certificates, AAA, and policy."],
      ["Why did my carrier auto-join me to Wi-Fi?", "A carrier-managed profile likely matched an approved partner network."],
      ["Why can't I forget or remove this network?", "It may be managed. Check carrier, MDM, app, or profile settings."],
      ["Do I need a username or password?", "Check the credential type. SIM and certificate profiles may not prompt."],
      ["Is Passpoint the same as OpenRoaming?", "No. Passpoint is the access technology; OpenRoaming is the federation model."],
      ["Why does it work on one phone but not another?", "Compare OS version, profile, EAP support, certificate trust, and policy."],
      ["Why did my device choose Wi-Fi instead of cellular?", "The device followed trusted network and carrier/OS selection policy."],
      ["Can the ANP or carrier see my traffic?", "They may see metadata and destinations unless higher-layer encryption protects the traffic."],
      ["Does Passpoint replace captive portals?", "For Passpoint users with profiles, yes. Keep portal support separate."]
    ]
  },
  "resources-detail": {
    summary: "Support teams need quick links to the documents that explain client behavior and escalation details.",
    meaning: ["OS vendor docs help with profile behavior.", "Standards docs help engineering confirm exact mechanisms.", "WBA and OpenRoaming docs help with federation and partner questions."],
    decisions: ["Group links by support task.", "Add vendor notes as appendices.", "Check links before sharing with external teams."],
    note: "A support guide is only useful if the right reference is one click away."
  }
};

content["comedic-plainspoken"] = {
  "executive-summary": {
    summary: "Passpoint is what happens when Wi-Fi stops asking every human to tap, guess, accept, and suffer. The device already has a profile, the network proves it matches, and the login goes through enterprise authentication.",
    meaning: ["Passpoint is Hotspot 2.0 wearing its useful shoes: find the network, check the profile, join securely.", "The user experience should feel like the phone handled it because, ideally, it did.", "The ANP still has work to do: identifiers, ANQP, security, AAA, accounting, and logs do not configure themselves."],
    decisions: ["Know who you are serving before you start checking boxes.", "Make the profile, identifiers, and AAA route agree with each other.", "Use this as the friendly map, then go read the serious documents for exact rules."],
    note: "If the metadata is wrong, the device will not be impressed."
  },
  "evolution": {
    summary: "WISPr was the era of trying to make captive portals behave. Passpoint is the era of not making the browser do the job of Wi-Fi authentication.",
    meaning: ["Captive portals are fine until a page changes, a browser blocks something, or a user gives up.", "Hotspot 2.0 lets the device ask useful questions before it joins.", "Passpoint adds the profile and enterprise authentication pieces so the device can just get on with it."],
    decisions: ["Do not build Passpoint like a portal with nicer wallpaper.", "Figure out the identity path first.", "Keep guest Wi-Fi separate for people who do not have the magic profile ticket."],
    note: "If your plan starts with 'then the user opens a browser,' take a breath and try again."
  },
  "standards": {
    summary: "R1, R2, and R3 are release buckets. They matter, but they do not magically make every phone and controller support the same thing.",
    meaning: ["R1 is the core join model.", "R2 brings in Online Sign-Up and profile repair ideas.", "R3 adds richer network info and stronger security options."],
    decisions: ["Check what your gear and clients actually support.", "Use the profile delivery method that people will realistically get onto devices.", "Do not let vendor menu names trick you into thinking the work is done."],
    note: "The newest acronym is not a deployment plan."
  },
  "connection-process": {
    summary: "The join flow is not mystical. The AP waves, the client asks questions, the profile says yes or no, and enterprise auth does the heavy lifting.",
    meaning: ["The beacon gives a small hint that Passpoint is available.", "ANQP gives the longer answer before association.", "If the device likes what it sees, WPA-Enterprise and EAP take over."],
    decisions: ["Do not cram the beacon like a suitcase before vacation.", "Test ANQP instead of hoping the phone will figure it out.", "Make sure the advertised EAP methods are real, not decorative."],
    note: "When troubleshooting, do not yell at the phone until you have checked the network's answers."
  },
  identifiers: {
    summary: "Domain, realm, RCOI, and PLMN are different tools. Using the wrong one is like labeling every drawer 'stuff' and calling it organized.",
    meaning: ["Domain says who the operator or home provider is.", "NAI realm helps the device and AAA figure out authentication.", "RCOI and PLMN support roaming groups and carrier offload."],
    decisions: ["Publish the identifiers your use case actually needs.", "Match realms to EAP methods that really work.", "Set venue and network hints honestly so clients do not make bad choices."],
    note: "ANQP should not make promises your AAA server cannot keep."
  },
  "client-profiles": {
    summary: "No profile, no party. The network can be perfect, but the device still needs the instructions and credential.",
    meaning: ["Profiles arrive through carriers, MDM, apps, downloads, or OS install flows.", "They carry the matching rules, credentials, EAP settings, certificates, and display names.", "Different operating systems will absolutely find different ways to be special."],
    decisions: ["Write down how each device gets the profile.", "Test matching and no-matching instead of assuming good vibes.", "Make profile updates and removal someone specific's job."],
    note: "Passpoint without a profile is just a very confident network waiting alone."
  },
  "wireless-security": {
    summary: "This is enterprise Wi-Fi, not a free-for-all guest network with a nicer hat.",
    meaning: ["Use WPA-Enterprise and EAP correctly.", "Plan WPA3, PMF, and band-specific requirements instead of discovering them at launch.", "Fast roaming keeps users moving without hammering AAA every few steps."],
    decisions: ["Pick EAP methods that match the credential type.", "Protect AAA from endless bad-login loops.", "Review isolation and local traffic policy like an adult."],
    note: "Automatic access should be convenient, not sloppy."
  },
  "aaa-radsec": {
    summary: "AAA is where the service either becomes real or becomes a ticket storm.",
    meaning: ["RADIUS over the open internet without protection is asking for trouble.", "RadSec wraps RADIUS in TLS for safer roaming paths.", "Accounting and location data tell you what happened after everyone stops guessing."],
    decisions: ["Protect external AAA paths.", "Get DNS, certificates, and trust anchors right before dynamic discovery.", "Standardize IDs and accounting so support can trace sessions."],
    note: "If you cannot trace it, you do not operate it. You are just hoping near a dashboard."
  },
  "deployment-patterns": {
    summary: "Pick a use case, build the minimum complete version, test it, then expand. Revolutionary stuff.",
    meaning: ["Plain 802.1X may be enough for some private enterprise use cases.", "Passpoint adds discovery and roaming intelligence.", "OpenRoaming adds federation, PKI, and partner rules."],
    decisions: ["Choose the first deployment target.", "Make a checklist and actually use it.", "Test real devices, not just the one phone someone had in their pocket."],
    note: "Small and working beats large and mysterious."
  },
  faq: {
    summary: "The FAQ is where we say the quiet part clearly: stop clicking the thing unless the workflow says to click the thing.",
    meaning: ["Users see a network and want to tap it. Understandable, but often wrong here.", "Passpoint works from a profile and credential.", "Support should explain that before diving into log archaeology."],
    decisions: ["Ask about the profile first.", "Then check ANQP, identifiers, EAP, certificates, and AAA.", "Know who owns the profile so users are not sent in circles."],
    note: "Best short answer: it should join automatically when the right profile exists.",
    faqItems: [
      ["I clicked the Passpoint network and it did not work. Why?", "Because in many deployments you are not supposed to click it. The device needs a matching profile, then it joins on its own."],
      ["Is Passpoint secure?", "Yes, when configured correctly. It uses enterprise Wi-Fi security, not open guest Wi-Fi optimism."],
      ["Why did my carrier auto-join me to Wi-Fi?", "Your carrier probably gave your device a profile that said this network is allowed."],
      ["Why can't I forget or remove this network?", "It may be managed by a carrier, app, or MDM. The delete button may live somewhere else."],
      ["Do I need a username or password?", "Maybe. Certificates and SIM credentials may do the job without asking you anything."],
      ["Is Passpoint the same as OpenRoaming?", "No. Passpoint is the access tech. OpenRoaming is the federation club using it."],
      ["Why does it work on one phone but not another?", "Because phones have profiles, policies, OS versions, and opinions."],
      ["Why did my device choose Wi-Fi instead of cellular?", "It found a trusted Wi-Fi path and decided that was the better move."],
      ["Can the ANP or carrier see my traffic?", "They can see some operational information. Use HTTPS or VPN if you need higher-layer privacy."],
      ["Does Passpoint replace captive portals?", "For users with profiles, yes. The portal can go bother the guest SSID."]
    ]
  },
  "resources-detail": {
    summary: "This guide is the appetizer. The standards and WBA docs are dinner.",
    meaning: ["Wi-Fi Alliance explains Passpoint program context.", "IEEE and IETF explain the protocol machinery.", "WBA and OpenRoaming docs explain federation and operations."],
    decisions: ["Keep links organized by what the reader is trying to do.", "Put vendor click-by-click instructions somewhere else.", "Check links before sending people on a scavenger hunt."],
    note: "Short guides stay useful when the deep links are not a mess."
  }
};

function normalizeFaq(section) {
  if (!section.faqItems) return section;
  return {
    ...section,
    faqItems: section.faqItems.map((item) => Array.isArray(item) ? { question: item[0], answer: item[1] } : item)
  };
}

function mergeSections(styleKey) {
  const overrides = content[styleKey];
  return baseSections.map((section) => {
    const update = overrides[section.id];
    if (!update) return section;
    return normalizeFaq({ ...section, ...update });
  });
}

function replaceConst(html, blockInfo, value) {
  const serialized = JSON.stringify(value, null, 6).replace(/\n/g, "\n    ");
  return html.slice(0, blockInfo.start) + serialized + html.slice(blockInfo.end);
}

function stylePage(styleKey) {
  const meta = styleShell[styleKey];
  let html = replaceConst(source, sectionBlock, mergeSections(styleKey));
  html = html.replace(/<title>.*?<\/title>/, `<title>Passpoint Quick Start Guide - ${meta.name}</title>`);
  html = html.replace(
    "<span>ANP learning map and expandable reference</span>",
    `<span>${meta.name} review version</span>`
  );
  html = html.replace(
    '<span class="pill draft-pill">Draft</span>',
    `<span class="pill draft-pill">Draft</span>\n        <span class="pill">${meta.shortName}</span>`
  );
  html = html.replace('<div class="kicker">Quick-start framework</div>', `<div class="kicker">${meta.kicker}</div>`);
  html = html.replace(/<h1>Passpoint, explained for the people who configure it\.<\/h1>/, `<h1>${meta.h1}</h1>`);
  html = html.replace(
    /<p class="lead">A concise guide for Access Network Providers:.*?<\/p>/,
    `<p class="lead">${meta.lead}</p>`
  );
  html = html.replace("</style>", `
    .style-review-link {
      display: inline-flex;
      margin-top: 14px;
      color: var(--primary);
      font-weight: 800;
      font-size: 13px;
    }
  </style>`);
  html = html.replace(
    '<div class="hero-actions">',
    `<a class="style-review-link" href="../">View all writing style versions</a>\n        <div class="hero-actions">`
  );
  html = html.replaceAll("assets/", "../../assets/");
  return html;
}

function landingPage() {
  const cards = Object.entries(styleShell).map(([slug, meta]) => `
        <a class="style-card" href="${slug}/">
          <span>${meta.shortName}</span>
          <strong>${meta.name}</strong>
          <p>${meta.deck}</p>
        </a>`).join("");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Passpoint Guide - Writing Style Review</title>
  <style>
    :root {
      --primary: #0b74b1;
      --green: #25d66c;
      --ink: #2f3033;
      --muted: #666f73;
      --line: #d9e1e5;
      --bg: #f2f2f2;
      --panel: #ffffff;
      --radius: 8px;
      --shadow: 0 10px 24px rgba(15, 39, 50, .08);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-family: Asap, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    a { color: inherit; text-decoration: none; }
    .shell { width: min(1120px, calc(100% - 32px)); margin: 0 auto; padding: 28px 0 42px; }
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 18px;
      padding: 20px 24px;
      border-radius: var(--radius);
      background: var(--primary);
      color: #fff;
      box-shadow: var(--shadow);
    }
    .brand { display: flex; align-items: center; gap: 16px; }
    .brand img { width: 156px; height: auto; }
    .brand strong { display: block; font-size: 17px; }
    .brand span { opacity: .9; font-size: 13px; }
    .pill { border: 1px solid rgba(255,255,255,.35); border-radius: 4px; padding: 8px 11px; font-weight: 800; font-size: 12px; text-transform: uppercase; }
    .hero { padding: 52px 0 30px; max-width: 820px; }
    .kicker { color: var(--primary); font-weight: 850; letter-spacing: .06em; text-transform: uppercase; font-size: 12px; }
    h1 { margin: 14px 0 12px; font-size: clamp(38px, 6vw, 68px); line-height: 1.02; letter-spacing: 0; }
    .lead { margin: 0; color: var(--muted); font-size: 18px; line-height: 1.55; }
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
    .style-card {
      min-height: 190px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--panel);
      padding: 20px;
      box-shadow: var(--shadow);
    }
    .style-card:hover { border-color: rgba(11,116,177,.45); transform: translateY(-1px); }
    .style-card span { color: var(--primary); font-weight: 850; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; }
    .style-card strong { display: block; margin-top: 12px; font-size: 22px; line-height: 1.15; }
    .style-card p { color: var(--muted); line-height: 1.45; margin: 14px 0 0; }
    .root-link { display: inline-flex; margin-top: 24px; color: var(--primary); font-weight: 850; }
    @media (max-width: 850px) {
      .topbar, .brand { align-items: flex-start; flex-direction: column; }
      .grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <main class="shell">
    <div class="topbar">
      <div class="brand">
        <img src="../assets/logos/wba-logo-white.png" alt="Wireless Broadband Alliance">
        <div>
          <strong>Passpoint Quick Start Guide</strong>
          <span>Writing style review versions</span>
        </div>
      </div>
      <span class="pill">Draft Review</span>
    </div>
    <section class="hero">
      <div class="kicker">Writing style review</div>
      <h1>Compare six ways to explain Passpoint.</h1>
      <p class="lead">Each version uses the same guide structure, visuals, section order, FAQ behavior, and reference links. Only the writing style changes so reviewers can focus on voice and clarity.</p>
      <a class="root-link" href="../">Back to current published guide</a>
    </section>
    <section class="grid" aria-label="writing style versions">
${cards}
    </section>
  </main>
</body>
</html>`;
}

const stylesDir = path.join(root, "styles");
fs.mkdirSync(stylesDir, { recursive: true });
fs.writeFileSync(path.join(stylesDir, "index.html"), landingPage());

for (const styleKey of Object.keys(styleShell)) {
  const outDir = path.join(stylesDir, styleKey);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), stylePage(styleKey));
}

console.log(`Generated ${Object.keys(styleShell).length} writing style versions in ${stylesDir}`);
