import type { EmailMessage, EmailSender, EmailAttachment } from "@/types/email";

const senders: EmailSender[] = [
  {
    name: "Unity Collective",
    email: "notifications@unityco.com",
    avatar: "UC",
    avatarBgColor: "from-pink-400 to-pink-600",
  },
  {
    name: "Synergy Squad",
    email: "team@synergysqd.com",
    avatar: "SS",
    avatarBgColor: "from-purple-400 to-purple-600",
  },
  {
    name: "Collaborative Crew",
    email: "hello@collabcrew.io",
    avatar: "CC",
    avatarBgColor: "from-blue-400 to-blue-600",
  },
  {
    name: "Visionary Group",
    email: "contact@visionarygrp.com",
    avatar: "VG",
    avatarBgColor: "from-green-400 to-green-600",
  },
  {
    name: "Empowerment Team",
    email: "support@empowerteam.net",
    avatar: "ET",
    avatarBgColor: "from-orange-400 to-orange-600",
  },
  {
    name: "Innovative Minds",
    email: "info@innovminds.co",
    avatar: "IM",
    avatarBgColor: "from-red-400 to-red-600",
  },
  {
    name: "Inspiration Hub",
    email: "hello@inspirehub.io",
    avatar: "IH",
    avatarBgColor: "from-indigo-400 to-indigo-600",
  },
  {
    name: "Dynamic Teamwork",
    email: "team@dynamicwork.com",
    avatar: "DT",
    avatarBgColor: "from-teal-400 to-teal-600",
  },
  {
    name: "Creative Collaborators",
    email: "creative@collab.studio",
    avatar: "CC",
    avatarBgColor: "from-cyan-400 to-cyan-600",
  },
];

const commonAttachments: EmailAttachment[] = [
  {
    id: "att-1",
    fileName: "terms-and-conditions.pdf",
    fileSize: "T&G #1",
    fileType: "pdf",
  },
  {
    id: "att-2",
    fileName: "brief-summary.docx",
    fileSize: "T&G #2",
    fileType: "docx",
  },
  {
    id: "att-3",
    fileName: "overview.docx",
    fileSize: "T&G #3",
    fileType: "docx",
  },
];

export const mockEmails: EmailMessage[] = [
  {
    id: "email-1",
    sender: senders[0],
    recipients: [
      { name: "You", email: "kathleen@sunak.com", type: "to" },
      { name: "Team", email: "team@sunak.com", type: "cc" },
    ],
    subject: "Notice: Your payment details have been updated.",
    preview: "Your team can continue using Slack for now. Just remember to up...",
    body: `Good morning,

We are pleased to share some significant updates with you. Effective July 1, 2024, our general terms and conditions (T&C) will be revised. This change primarily allows you to take advantage of new practical features on the application's AI subscription and marketplace.

Here's a brief summary of the key updates:

Our company name has been updated to Marketplace GmbH.

New features now available include the ability to add photos and videos to product reviews, as well as the option to ask and answer questions about products. Section 4 of the general terms of use has been updated to include these new functionalities.

You have the right to object to the amended GTC within two weeks of receiving this email by logging into your customer account and deleting your account. If no objection is raised, the new GTC will automatically take effect after this two-week period.

We wish you enjoyable shopping at competitive prices on the marketplace!

Have a wonderful day.`,
    timestamp: "2024-12-07T17:35:00Z",
    dateGroup: "Today",
    tags: [
      { id: "tag-1", label: "T&G #1", variant: "primary" },
      { id: "tag-2", label: "T&G #2", variant: "secondary" },
      { id: "tag-3", label: "T&G #3", variant: "success" },
    ],
    attachments: commonAttachments,
    isRead: false,
    isStarred: true,
    category: "primary",
  },
  {
    id: "email-2",
    sender: senders[1],
    recipients: [
      { name: "You", email: "kathleen@sunak.com", type: "to" },
      { name: "Client", email: "client@sunak.com", type: "cc" },
    ],
    subject: "Alert: Your payment is scheduled for processing.",
    preview: "We are pleased to share some significant updates with you. Effective July 1, 2024, our general terms...",
    body: `Good morning,

We are pleased to share some significant updates with you. Effective July 1, 2024, our general terms and conditions (T&C) will be revised. This change primarily allows you to take advantage of new practical features on the application's AI subscription and marketplace.

You can keep using Slack for the time being. Just make sure to refresh your payment details when prompted.

Best regards,
The Synergy Squad Team`,
    timestamp: "2024-12-07T16:05:00Z",
    dateGroup: "Today",
    tags: [
      { id: "tag-4", label: "T&G #1", variant: "warning" },
      { id: "tag-5", label: "T&G #2", variant: "default" },
      { id: "tag-6", label: "T&G #3", variant: "success" },
    ],
    attachments: [],
    isRead: false,
    isStarred: false,
    category: "primary",
    hasNewBadge: true,
  },
  {
    id: "email-3",
    sender: senders[2],
    recipients: [{ name: "You", email: "kathleen@sunak.com", type: "to" }],
    subject: "Heads Up: Your payment is pending approval.",
    preview: "For the time being, your team can still access Slack. Make sure to...",
    body: `Hi there,

For the time being, your team can still access Slack. Make sure to update your payment information soon to avoid any interruptions.

Thank you,
Collaborative Crew`,
    timestamp: "2024-12-07T12:45:00Z",
    dateGroup: "Today",
    tags: [{ id: "tag-7", label: "Important", variant: "warning" }],
    attachments: [],
    isRead: true,
    isStarred: true,
    category: "primary",
  },
  {
    id: "email-4",
    sender: senders[3],
    recipients: [{ name: "You", email: "kathleen@sunak.com", type: "to" }],
    subject: "Notification: Your payment has been successfully processed.",
    preview: "Your team can use Slack for now. Just be sure to update your pay...",
    body: `Hello,

Your team can use Slack for now. Just be sure to update your payment details when necessary.

Regards,
Visionary Group`,
    timestamp: "2024-12-07T08:20:00Z",
    dateGroup: "Today",
    tags: [{ id: "tag-8", label: "Success", variant: "success" }],
    attachments: [],
    isRead: true,
    isStarred: false,
    category: "primary",
  },
  {
    id: "email-5",
    sender: senders[4],
    recipients: [{ name: "You", email: "kathleen@sunak.com", type: "to" }],
    subject: "Payment Reminder: Don't forget to complete your transaction.",
    preview: "You can keep using Slack for the time being. Just make sure to ref...",
    body: `Good day,

You can keep using Slack for the time being. Just make sure to refresh your account details before the deadline.

Best,
Empowerment Team`,
    timestamp: "2024-12-06T15:25:00Z",
    dateGroup: "Yesterday",
    tags: [{ id: "tag-9", label: "Reminder", variant: "default" }],
    attachments: [],
    isRead: true,
    isStarred: false,
    category: "primary",
  },
  {
    id: "email-6",
    sender: senders[5],
    recipients: [{ name: "You", email: "kathleen@sunak.com", type: "to" }],
    subject: "Reminder: Your payment is due soon!",
    preview: "For now, your team can continue using Slack. Just remember to...",
    body: `Hi,

For now, your team can continue using Slack. Just remember to update everything before the grace period ends.

Cheers,
Innovative Minds`,
    timestamp: "2024-12-06T14:30:00Z",
    dateGroup: "Yesterday",
    tags: [{ id: "tag-10", label: "Due Soon", variant: "warning" }],
    attachments: [commonAttachments[0], commonAttachments[1]],
    isRead: false,
    isStarred: false,
    category: "primary",
  },
  {
    id: "email-7",
    sender: senders[6],
    recipients: [{ name: "You", email: "kathleen@sunak.com", type: "to" }],
    subject: "Action Required: Verify your payment method.",
    preview: "Your team will have access to Slack for now. Please update your p...",
    body: `Hello,

Your team will have access to Slack for now. Please update your payment verification as soon as possible.

Thank you,
Inspiration Hub`,
    timestamp: "2024-12-06T13:10:00Z",
    dateGroup: "Yesterday",
    tags: [{ id: "tag-11", label: "Action Required", variant: "primary" }],
    attachments: [],
    isRead: true,
    isStarred: false,
    category: "primary",
  },
  {
    id: "email-8",
    sender: senders[7],
    recipients: [{ name: "You", email: "kathleen@sunak.com", type: "to" }],
    subject: "Update: Your payment has been received!",
    preview: "Your team will still have access to Slack. Make sure to update yo...",
    body: `Hi there,

Your team will still have access to Slack. Make sure to update your records accordingly.

Best regards,
Dynamic Teamwork`,
    timestamp: "2024-12-06T11:50:00Z",
    dateGroup: "Yesterday",
    tags: [{ id: "tag-12", label: "Received", variant: "success" }],
    attachments: [],
    isRead: true,
    isStarred: true,
    category: "primary",
  },
  {
    id: "email-9",
    sender: senders[8],
    recipients: [{ name: "You", email: "kathleen@sunak.com", type: "to" }],
    subject: "Payment Confirmation: Your transaction was successful!",
    preview: "Your team can still use Slack for now. Just remember to update...",
    body: `Good morning,

Your team can still use Slack for now. Just remember to update your billing information when necessary.

Warm regards,
Creative Collaborators`,
    timestamp: "2024-12-06T08:15:00Z",
    dateGroup: "Yesterday",
    tags: [{ id: "tag-13", label: "Confirmed", variant: "success" }],
    attachments: [],
    isRead: false,
    isStarred: false,
    category: "primary",
  },
  // Company emails
  {
    id: "email-10",
    sender: senders[0],
    recipients: [{ name: "All Staff", email: "staff@company.com", type: "to" }],
    subject: "Q4 Company Meeting - December 15th",
    preview: "Join us for our quarterly company meeting to discuss achievements and goals...",
    body: `Dear Team,

We're excited to invite you to our Q4 company meeting on December 15th. We'll be reviewing our achievements and setting goals for the next quarter.

See you there!`,
    timestamp: "2024-12-06T09:00:00Z",
    dateGroup: "Yesterday",
    tags: [{ id: "tag-14", label: "Meeting", variant: "primary" }],
    attachments: [],
    isRead: true,
    isStarred: false,
    category: "company",
  },
  // Promotions
  {
    id: "email-11",
    sender: senders[2],
    recipients: [{ name: "You", email: "kathleen@sunak.com", type: "to" }],
    subject: "50% Off All Premium Plans - Limited Time!",
    preview: "Upgrade your account today and save 50% on all premium plans...",
    body: `Hi there,

Don't miss out on our biggest sale of the year! Upgrade to premium and save 50% today only.

Shop now!`,
    timestamp: "2024-12-07T10:00:00Z",
    dateGroup: "Today",
    tags: [{ id: "tag-15", label: "Sale", variant: "warning" }],
    attachments: [],
    isRead: false,
    isStarred: false,
    category: "promotions",
  },
  // More Primary emails
  {
    id: "email-12",
    sender: senders[1],
    recipients: [{ name: "You", email: "kathleen@sunak.com", type: "to" }],
    subject: "Weekly Report: Your team performance summary",
    preview: "Here is your weekly performance report for the week ending December 6th...",
    body: `Hello Team,

Here is your weekly performance report for the week ending December 6th.

Key Highlights:
- Total tasks completed: 47
- Average response time: 2.3 hours
- Customer satisfaction: 94%

Your team has shown excellent performance this week. Keep up the great work!

We've attached the detailed analytics report for your review.

Best regards,
Synergy Squad Team`,
    timestamp: "2024-12-06T07:00:00Z",
    dateGroup: "Yesterday",
    tags: [
      { id: "tag-16", label: "Report", variant: "primary" },
      { id: "tag-17", label: "Weekly", variant: "secondary" },
    ],
    attachments: [
      {
        id: "att-4",
        fileName: "weekly-report.pdf",
        fileSize: "2.4 MB",
        fileType: "pdf",
      },
    ],
    isRead: true,
    isStarred: true,
    category: "primary",
  },
  {
    id: "email-13",
    sender: senders[3],
    recipients: [
      { name: "You", email: "kathleen@sunak.com", type: "to" },
      { name: "Marketing", email: "marketing@sunak.com", type: "cc" },
    ],
    subject: "New Feature Launch: AI-Powered Analytics",
    preview: "We are excited to announce the launch of our new AI-powered analytics feature...",
    body: `Dear Valued Customer,

We are excited to announce the launch of our new AI-powered analytics feature!

This powerful new tool will help you:
- Gain deeper insights into your data
- Make data-driven decisions faster
- Predict trends with machine learning
- Automate reporting tasks

The feature is now available in your dashboard. Click the "Analytics" tab to get started.

We've prepared a comprehensive guide to help you make the most of this new feature.

Happy analyzing!

The Visionary Group Team`,
    timestamp: "2024-12-05T14:30:00Z",
    dateGroup: "December 5",
    tags: [
      { id: "tag-18", label: "Product", variant: "primary" },
      { id: "tag-19", label: "Launch", variant: "success" },
    ],
    attachments: [
      {
        id: "att-5",
        fileName: "analytics-guide.pdf",
        fileSize: "1.8 MB",
        fileType: "pdf",
      },
    ],
    isRead: false,
    isStarred: false,
    category: "primary",
  },
  {
    id: "email-14",
    sender: senders[4],
    recipients: [{ name: "You", email: "kathleen@sunak.com", type: "to" }],
    subject: "Security Alert: New login from unknown device",
    preview: "We detected a new login to your account from a device we don't recognize...",
    body: `Hello,

We detected a new login to your account from a device we don't recognize.

Details:
- Device: MacBook Pro
- Location: San Francisco, CA
- Time: December 5, 2024 at 3:45 PM
- IP Address: 192.168.1.100

If this was you, you can safely ignore this email. If you don't recognize this activity, please secure your account immediately by:

1. Changing your password
2. Enabling two-factor authentication
3. Reviewing recent account activity

Your security is our top priority.

Best regards,
Empowerment Team Security`,
    timestamp: "2024-12-05T15:45:00Z",
    dateGroup: "December 5",
    tags: [
      { id: "tag-20", label: "Security", variant: "warning" },
      { id: "tag-21", label: "Alert", variant: "warning" },
    ],
    attachments: [],
    isRead: false,
    isStarred: true,
    category: "primary",
  },
  {
    id: "email-15",
    sender: senders[5],
    recipients: [{ name: "You", email: "kathleen@sunak.com", type: "to" }],
    subject: "Invoice #INV-2024-1234 - Payment Received",
    preview: "Thank you for your payment. Your invoice has been marked as paid...",
    body: `Dear Customer,

Thank you for your payment. Your invoice #INV-2024-1234 has been marked as paid.

Payment Details:
- Amount: $199.00
- Payment Method: Credit Card (****4242)
- Transaction ID: TXN-2024-5678
- Date: December 5, 2024

You can download your receipt from the attachment below.

If you have any questions about this payment, please don't hesitate to contact our billing department.

Thank you for your business!

Innovative Minds Billing Team`,
    timestamp: "2024-12-05T11:20:00Z",
    dateGroup: "December 5",
    tags: [
      { id: "tag-22", label: "Invoice", variant: "success" },
      { id: "tag-23", label: "Paid", variant: "success" },
    ],
    attachments: [
      {
        id: "att-6",
        fileName: "invoice-2024-1234.pdf",
        fileSize: "245 KB",
        fileType: "pdf",
      },
      {
        id: "att-7",
        fileName: "receipt.pdf",
        fileSize: "180 KB",
        fileType: "pdf",
      },
    ],
    isRead: true,
    isStarred: false,
    category: "primary",
  },
  {
    id: "email-16",
    sender: senders[6],
    recipients: [
      { name: "You", email: "kathleen@sunak.com", type: "to" },
      { name: "All Staff", email: "staff@sunak.com", type: "cc" },
    ],
    subject: "Team Building Event - December 15th",
    preview: "Join us for our annual team building event on December 15th at the downtown office...",
    body: `Hi Team,

Join us for our annual team building event on December 15th at the downtown office!

Event Details:
- Date: Friday, December 15, 2024
- Time: 2:00 PM - 6:00 PM
- Location: Downtown Office, Conference Room A
- Dress Code: Casual

Activities planned:
- Icebreaker games
- Team challenges
- Networking session
- Dinner and drinks

Please RSVP by December 10th so we can finalize catering arrangements.

Looking forward to seeing everyone there!

Best regards,
Inspiration Hub Events Team`,
    timestamp: "2024-12-04T09:00:00Z",
    dateGroup: "December 4",
    tags: [
      { id: "tag-24", label: "Event", variant: "primary" },
      { id: "tag-25", label: "Team", variant: "secondary" },
    ],
    attachments: [],
    isRead: false,
    isStarred: false,
    category: "primary",
  },
  {
    id: "email-17",
    sender: senders[7],
    recipients: [{ name: "You", email: "kathleen@sunak.com", type: "to" }],
    subject: "Project Update: Q4 Roadmap Progress",
    preview: "Quick update on our Q4 roadmap progress. We are on track to meet all major milestones...",
    body: `Hello,

Quick update on our Q4 roadmap progress.

Progress Summary:
✓ Feature A - Completed (100%)
✓ Feature B - Completed (100%)
⚡ Feature C - In Progress (75%)
📋 Feature D - Planning (25%)

We are on track to meet all major milestones for the quarter. Feature C is progressing well and should be completed by next week.

The team has been working hard, and we're excited about the upcoming releases.

Next Steps:
- Complete Feature C by December 12
- Begin development on Feature D
- Prepare for Q1 2025 planning

Thank you all for your hard work and dedication!

Dynamic Teamwork Project Lead`,
    timestamp: "2024-12-04T16:30:00Z",
    dateGroup: "December 4",
    tags: [
      { id: "tag-26", label: "Project", variant: "primary" },
      { id: "tag-27", label: "Update", variant: "secondary" },
    ],
    attachments: [
      {
        id: "att-8",
        fileName: "q4-roadmap.pdf",
        fileSize: "3.2 MB",
        fileType: "pdf",
      },
    ],
    isRead: true,
    isStarred: true,
    category: "primary",
  },
  {
    id: "email-18",
    sender: senders[8],
    recipients: [{ name: "You", email: "kathleen@sunak.com", type: "to" }],
    subject: "Feedback Request: Recent Support Experience",
    preview: "We would love to hear about your recent support experience with our team...",
    body: `Hi there,

We would love to hear about your recent support experience with our team!

Your feedback helps us improve our service and better serve customers like you.

Please take a moment to rate your experience:
- How satisfied were you with the response time?
- Did our team resolve your issue?
- How would you rate the overall experience?

Click the link below to complete our quick 2-minute survey.

As a thank you, we'll enter you into a draw to win a $50 gift card!

Thank you for being a valued customer.

Creative Collaborators Support Team`,
    timestamp: "2024-12-03T13:15:00Z",
    dateGroup: "December 3",
    tags: [
      { id: "tag-28", label: "Feedback", variant: "secondary" },
      { id: "tag-29", label: "Survey", variant: "default" },
    ],
    attachments: [],
    isRead: false,
    isStarred: false,
    category: "primary",
  },
  // More Company emails
  {
    id: "email-19",
    sender: senders[1],
    recipients: [{ name: "All Staff", email: "staff@company.com", type: "to" }],
    subject: "Office Closure: Holiday Schedule",
    preview: "Please note that our offices will be closed for the holidays from December 23rd to January 2nd...",
    body: `Dear Team,

Please note that our offices will be closed for the holidays from December 23rd to January 2nd.

Holiday Schedule:
- Last working day: Friday, December 22nd
- Office closed: December 23rd - January 2nd
- Back to work: Wednesday, January 3rd

During the closure:
- Emergency support will be available via email
- Response times may be slower than usual
- All non-urgent matters will be addressed when we return

Please plan your work accordingly and ensure all critical tasks are completed before the break.

Wishing you all a wonderful holiday season!

Best regards,
Company Management`,
    timestamp: "2024-12-03T10:00:00Z",
    dateGroup: "December 3",
    tags: [
      { id: "tag-30", label: "Important", variant: "warning" },
      { id: "tag-31", label: "Holiday", variant: "default" },
    ],
    attachments: [],
    isRead: true,
    isStarred: true,
    category: "company",
  },
  {
    id: "email-20",
    sender: senders[0],
    recipients: [{ name: "All Staff", email: "staff@company.com", type: "to" }],
    subject: "New Employee Welcome: Join us in welcoming Sarah Johnson",
    preview: "We are excited to announce that Sarah Johnson will be joining our team as Senior Product Manager...",
    body: `Dear Team,

We are excited to announce that Sarah Johnson will be joining our team as Senior Product Manager starting December 11th!

About Sarah:
Sarah brings over 8 years of experience in product management, most recently from TechCorp where she led the development of their flagship mobile app. She holds an MBA from Stanford and a BS in Computer Science from MIT.

Sarah will be working closely with our engineering and design teams to drive our product roadmap forward.

Please join us in welcoming Sarah to the team! We'll be having a welcome lunch on her first day - details to follow.

Looking forward to working with you all!

Unity Collective HR Team`,
    timestamp: "2024-12-02T14:00:00Z",
    dateGroup: "December 2",
    tags: [
      { id: "tag-32", label: "HR", variant: "primary" },
      { id: "tag-33", label: "Welcome", variant: "success" },
    ],
    attachments: [],
    isRead: false,
    isStarred: false,
    category: "company",
  },
  // More Promotions
  {
    id: "email-21",
    sender: senders[3],
    recipients: [{ name: "You", email: "kathleen@sunak.com", type: "to" }],
    subject: "Exclusive Offer: Upgrade to Pro and Get 3 Months Free!",
    preview: "For a limited time, upgrade to our Pro plan and get 3 months absolutely free...",
    body: `Hi there,

For a limited time, upgrade to our Pro plan and get 3 months absolutely free!

Pro Plan includes:
✓ Unlimited storage
✓ Advanced analytics
✓ Priority support
✓ Custom branding
✓ API access

This exclusive offer is only available until December 15th.

Upgrade now and start enjoying premium features today!

Click below to claim this offer.

Visionary Group Sales Team`,
    timestamp: "2024-12-07T08:00:00Z",
    dateGroup: "Today",
    tags: [
      { id: "tag-34", label: "Promotion", variant: "warning" },
      { id: "tag-35", label: "Limited", variant: "warning" },
    ],
    attachments: [],
    isRead: false,
    isStarred: false,
    category: "promotions",
  },
];

export const getCategoryCounts = () => ({
  primary: mockEmails.filter((e) => e.category === "primary").length,
  company: mockEmails.filter((e) => e.category === "company").length,
  promotions: mockEmails.filter((e) => e.category === "promotions").length,
  socials: mockEmails.filter((e) => e.category === "socials").length,
  updates: mockEmails.filter((e) => e.category === "updates").length,
});
