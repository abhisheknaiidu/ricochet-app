# Ricochet Lite App

### Welcome to Ricochet

👍🎉 First and foremost, thank you for taking the time to contribute 🎉👍

The following is a set of guidelines for contributing to the Ricochet ecosystem, which is hosted in our GitHub organization. 

These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

Ricochet Exchange is a decentralised dollar-cost-averaging streaming platform.

#### Table Of Contents

1. [Code of Conduct](#code-of-conduct)
2. [What should I know before I get started?](#what-should-i-know-before-i-get-started)
2.1 [Ricochet and Packages](#ricochet-and-packages)
2.2 [Ricochet Design Decisions](#design-decisions)
3. [How Can I Contribute?](#how-can-i-contribute)
  3.1 [Reporting Bugs](#reporting-bugs)
  3.2 [Suggesting Enhancements](#suggesting-enhancements)
  3.3 [Your First Code Contribution](#your-first-code-contribution)
  3.4 [Pull Requests](#pull-requests)
4. [Styleguides](#styleguides)
  4.1 [TypeScript Styleguide](#typescript-styleguide)
  4.2 [Documentation Styleguide](#documentation-styleguide)
5. [Important Resources](#important-resources)
  5.1 [Links and Docs](#links-and-docs)

## Code of Conduct

In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to making participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

The core team of Ricochet reserves the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct, or to ban temporarily or permanently any contributor for other behaviors that they deem inappropriate, threatening, offensive, or harmful.

## What should I know before I get started?

### Ricochet and Packages

Ricochet Exchange Lite is a Single Page Application designed to be fast and reliable, we use the following technologies to build our application.

### Main technologies.

 - **Typescript:**  All files are written in typescript to ensure type safety.
 - **Yarn:**  To avoid bugs please remember to always use yarn, using NPM will cause build errors.
 - **Recharts, React Components:**  UI features should be built following React's functional components standards, any data visualisation should be built with Recharts [React Functional Components](https://react.dev/learn/keeping-components-pure)
 - **Tailwind:**  We use Tailwindcss for our styles, all styles must be written in Tailwind do not use vanilla CSS or modules, the ./tailwind.config.js file has the color themes: [Tailwind docs](https://tailwindcss.com/docs/utility-first)
 - **Redux Slices:**  For state management, all external API calls and services should be handled in slices [Read the docs](https://redux-toolkit.js.org/tutorials/overview)
 - **Wagmi/Ethers**  Wagmi for User, Network and Wallet hooks, Ethers for Transactions and contracts **note: we are trying to migrate to using only Wagmi, contributions that follow that will be appreciated**: [Wagmi](https://wagmi.sh/react/client) [EtherJs](https://docs.ethers.org/v5/)
 - **Superfluid SDK/Superfluid Graph**   Our application relies on the Superfluid SDK to start/stop/edit streams, and retrieve data:  [Read the docs](https://docs.superfluid.finance/superfluid/developers/sdk-core)

### Design Decisions

We have a standard for our application design, the color scheme and general formating will be stored within the theme.ts file in [themes.ts](https://github.com/Seroxdesign/ricochet-app/blob/develop/tailwind.config.js). Please ensure new additions to the UI use the colors and styles declared in this folder.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for Ricochet Exchange. Following these guidelines helps maintainers and the community understand your report :pencil:, reproduce the behavior :computer: :computer:, and find related reports :mag_right:.

Before creating bug reports, please include as many details as possible and check to see if someone else has already reported the bug. Fill out [the required Information](https://github.com/Ricochet-Exchange/ricochet-frontend/blob/v2/.github/ISSUE_TEMPLATE/bug_report.md), the information it asks for helps us resolve issues faster.

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Ricochet, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion :pencil: and find related suggestions :mag_right:.

Before creating enhancement suggestions, please check our [dework and roadmap](https://app.dework.xyz/ricochet-exchange-da) as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please be descriptive and fill in [the template](https://github.com/Ricochet-Exchange/ricochet-frontend/blob/v2/.github/ISSUE_TEMPLATE/feature_request.md), including the steps that you imagine you would take if the feature you're requesting existed.

> **Note:** It takes time to get through the feature request backlog, you can stay updated in our [discord community](https://discord.gg/sbn3et6rk3)

### Your First Code Contribution

Please notify the team that you will be contributing and what you will be doing to avoid development conflicts.

#### Local development

Ricochet App and all packages can be developed locally.
For instructions on how to do this, see the following sections in the [Get started with Ricochet App locally](https://github.com/Seroxdesign/ricochet-app/blob/develop/README.md)
If you have any trouble drop in the [Discord server](https://discord.gg/J22JgwDTVz) and let the core team know what errors you get so we can help you resolve it quickly.

### Pull Requests

The process described here has several goals:

- Maintain Ricochet's quality
- Fix problems that are important to users
- Engage the community in building the best for the community
- Enable a sustainable system for Ricochet's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Create a branch with a title relevant to your contribution please make sure to follow the Dework branch naming convention {username}/{dework taks number}/{dework task title}
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all checks are passing <details><summary>What if the status checks are failing?</summary>If a status check is failing, and you believe that the failure is unrelated to your change, please leave a comment on the pull request explaining why you believe the failure is unrelated. A maintainer will re-run the status check for you. If we conclude that the failure was a false positive, then we will open an issue to track that problem with our status check suite.</details>
4. Allow the core team time to test and review changes.

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Styleguides

### TypeScript Styleguide

* Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
* Inline `export`s with expressions whenever possible
  ```js
  // Use this:
  export default class ClassName {

  }

  // Instead of:
  class ClassName {

  }
  export default ClassName
  ```
* We prefer single tab (2 spaces) for indentation.
* Only use Tailwind for styles, inline styles, module files or alternative UI packages will not be accepted.
* Keep it DRY, avoid repetitive code, and if a function is complex leave comments to help the next contributor.
* Minimize useEffects in code to keep performance up and reduce the complexity of the code.
* If you're in doubt about your code readability, write comments and make it easier for the next contributor.
* Clean code will be appreciated, always aim to keep a file cleaner than you left it.

### Documentation Styleguide

* Use [Markdown](https://daringfireball.net/projects/markdown).
* Write comments and documentation in clear, concise English.
* Link references if needed.

### Important Resources

Ricochet has a Github organization for version control, a Dework for listing bounties, a Medium account for documentation, and a discord for our community. Please consider joining us on any of these platforms to connect with our community.

#### Links and Docs

- [Ricochet Webapp](https://ricochet-exchange.eth.limo/)
- [Documentation](https://docs.ricochet.exchange/docs/quickstart)
- [Discord Community](https://discord.gg/J22JgwDTVz)
- [Bounties Program on Dework](https://app.dework.xyz/ricochet-exchange-da)
- [Ricochet Twitter](https://twitter.com/ricochetxchange)
- [Community Voting](https://snapshot.org/#/ricochet.eth)
- [Blog](https://medium.com/ricochet-exchange)

### Thank you
