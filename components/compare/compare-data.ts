export type Score = number | [number, { adv?: string; disadv: string }]

type Row = {
  d_name: string
  desc: string
  scores: [Score, Score, Score]
  scores_with_bounty?: [Score, Score, Score]
}
type Category = { name: string; rows: Row[] }

export const tableData: Category[] = [
  {
    name: 'Accurate Results',
    rows: [
      {
        d_name: 'Auditable Voter Authentication',
        desc: 'How sure are we that only legitimate voters are voting, and only once each?',
        scores: [
          [
            7,
            {
              adv: `Allows for a combination of auth methods: verified email delivery, SMS, drawn e-signatures, time-based one-time passwords, IP address geolocation, government ID photos, and cryptographic key pairs.
Strong remediation process allowing admins to revoke voter credentials at any stage of the election, including post-voting and tallying phases.`,

              disadv: ``
            }
          ],
          [
            5,
            {
              adv: `We confirm that the voter is in control of their mailbox. Or that the person casting a vote has access to the voter's mailbox.
              Election administrators can require signatures that are verified against the signatures on file.`,

              disadv: `Anyone with access to the mailbox, including children, spouses, roommates, can also access the blank ballot.
              Forging signatures especially with a reference is not that difficult. Schoolchildren sometimes do it for their parents.
              Verifying a lot of signatures is a relatively costly manual process.
              Depends on the postal mail system working quickly and without errors.
              Because of slowness, everything needs to be done and executed far in advance. And registration errors cannot quickly be remediated.
              Many mail boxes are not locked.
              Postage costs to send custom ballots ~$1/voter.
              Voters sometimes fail to update their mailing address when they move.
              How easy is it to create a bunch of fake votes and add them, without anyone noticing? It is hard to know.`
            }
          ],
          [
            7,
            {
              adv: `Have to show up in person
Can limit to resident's unique precinct
Can require photo ID`,
              disadv: `Vulnerable to ballot stuffing: all ballot boxes must be watched at all times by multiple observers
Limited post-election auditability
Once ballots accepted, limited remediation options`
            }
          ]
        ]
      },
      {
        d_name: 'Verifiable results',
        desc: 'How sure are we that the votes were tallied up correctly, without any votes lost or modified?',
        scores: [
          9,
          [
            3,
            {
              disadv: `Inherits all the disadvantages of safely verifying tallying of in-person voting, plus introduces new risks:
              It is hard to know what happens with the ballot once you put your ballot into a mailbox. There are lots of opportunities for it to get tampered with or lost.
              Because mailboxes are so geographically spread out, it is very difficult to comprehensively monitor.
              Limited ability to audit after the fact.`
            }
          ],
          [
            5,
            {
              adv: `There is a process to get votes to the final tallying without  tampering. That process is not perfect, but it is relatively good. It usually requires a lot of people to be corrupt to facilitate errors.
              My preferred candidate ideally can send election observers. But there is often so many polling locations and times to vote that is very difficult to get anything close to complete coverage.
              Electronic tallying machines themselves can be audited using powerful post-election RLA techniques.`,
              disadv: `I cast a vote but have little-to-no direct evidence whether my vote counted.
              People carrying out the process are usually strangers, with little way for the vast majority of voters to tell if they're trustworthy.
              The process is fundamentally an imperfect system that can try its best to mitigate attacks & errors, but at the end of the day can never provide "proof" of correctness, only absence of uncovered attacks. As Carl Sagan famously noted, "Absence of Evidence does not mean Evidence of Absence".`
            }
          ]
        ]
      }
    ]
  },
  {
    name: 'Honest Vote Selections',
    rows: [
      {
        d_name: 'Vote privacy',
        desc: 'How confident can individual voters be that no one else will learn their ballot selections?',
        scores: [
          8,
          [
            4,
            {
              adv: ``,
              disadv: ``
            }
          ],
          [
            6,
            {
              adv: `Voters are alone in the booth, which gives the perception of privacy`,
              disadv: `Many elections often give ballot unique tracking numbers, making voter selections linkable back to voter's identity by administrators
              Voters are not in control of the space they vote in, and have limited time to inspect or test security`
            }
          ]
        ]
      },
      {
        d_name: 'Coercion resistance',
        desc: 'How protected are voters against attempts to threaten or purchase their vote selections?',
        scores: [4, 5, 7],
        scores_with_bounty: [
          7,
          [
            6,
            {
              disadv: `Potential for vote-by-mail fraud where someone intercepts and alters the ballots.
            Voter signs the blank ballot and gives it to the buyer.
            Family or friends potentially steal or influence the vote choices.`
            }
          ],
          [
            8,
            {
              disadv: `Voters could potentially be coerced before arriving at the polling station.
            Voters can record a video to show it to their coercer as proof`
            }
          ]
        ]
      }
    ]
  },
  {
    name: 'Voter Experience',
    rows: [
      {
        d_name: 'Accessibility',
        desc: 'How accessible is the voting process for all members of the electorate, especially those with disabilities?',
        scores: [
          8,
          [
            6,
            {
              adv: `Beneficial for elderly, disabled, or remote/rural voters who find it hard to reach polling stations.,
              Offers convenience as voters can take their time to complete the ballot.
              Reduction in In-Person Voting Issues: Issues such as long lines, malfunctioning machines, or polling place closures can impact the results of in-person voting. Mail-in voting helps alleviate these issues.`,
              disadv: ` There is a possibility of delivery delays causing votes to arrive too late to be counted.
              Some people might not receive their mail-in ballot due to issues with their registration status, incorrect mailing address, or other administrative errors. This could unintentionally disenfranchise certain voters.`
            }
          ],
          [
            5,
            {
              adv: `In-person assistance is available for those who need it.`,
              disadv: `May be difficult for individuals with mobility issues or remote/rural voters to reach polling stations.
            Limited voting hours may restrict some people from being able to vote.`
            }
          ]
        ]
      },
      {
        d_name: 'Speed of voting',
        desc: 'How quickly can individual voters participate?',
        scores: [
          8,
          [
            7,
            {
              adv: `Allows voters to vote at their own pace without feeling rushed.
            Eliminates wait times at polling stations.`,
              disadv: `Dependent on the postal service speed and reliability.
            Requires voters to plan ahead to ensure their ballot is postmarked in time.
            `
            }
          ],
          [
            2,
            {
              adv: `No need to worry about postal delays`,
              disadv: `Long lines and wait times can occur.
          Efficiency depends on staffing and organization of the polling station.`
            }
          ]
        ]
      },
      {
        d_name: 'Speed of tallying',
        desc: 'How quickly can results be tallied?',
        scores: [
          9,
          [
            2,
            {
              adv: `Early voting results can be counted before the day of the election, which can speed up the overall results.`,
              disadv: `Counting mail-in ballots is typically slower due to the verification process for each ballot.
            Results can be delayed if there's a large volume of mail-in ballots.
            `
            }
          ],
          [
            4,
            {
              adv: `No need to worry about postal delays`,
              disadv: `Manual counting can be slow and error-prone.
              Longer wait times for results if recounting is required.`
            }
          ]
        ]
      }
    ]
  },
  {
    name: 'Costs',
    rows: [
      {
        d_name: 'Affordability to administer',
        desc: 'How affordable are the total costs to administer a secure election?',
        scores: [
          8,
          [
            4,
            {
              adv: `Can be less expensive as it requires fewer polling stations, less staff on election day, and less security for in-person voting.`,
              disadv: `The cost of printing, distributing, and returning the mail-in ballots can be high.
            Increased cost for verification and handling of mail-in ballots.
            Risk of increased expenditure on dealing with legal disputes over mail-in ballot validity.
            `
            }
          ],
          [
            2,
            {
              disadv: `Requires significant staffing for polling stations.
            Cost of printing and handling physical ballots.
            Higher costs due to the need for transportation and storage of physical ballots.`
            }
          ]
        ]
      }
    ]
  }
]
