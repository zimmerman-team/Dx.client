import BackupIcon from "@app/modules/home-module/sub-modules/pricing/assets/backup";
import AddChartIcon from "@app/modules/home-module/sub-modules/pricing/assets/add-chart";
import StoryIcon from "@app/modules/home-module/sub-modules/pricing/assets/story";
import UserShieldIcon from "@app/modules/home-module/sub-modules/pricing/assets/user-shied";
import SupportIcon from "@app/modules/home-module/sub-modules/pricing/assets/support";

export const features = [
  {
    title: "Connect Data",
    subtitle:
      "Effortlessly integrate your data from multiple sources with our comprehensive data connection features.",
    color: "#DADAF8",
    icon: BackupIcon,
    options: [
      {
        name: "Number of  datasets or data size",
        info: "The amount of datasets you can manage",
        values: [
          "5 datasets / 1GB",
          "100 datasets / 10GB",
          "1.000 datasets / 25GB",
          "10.000 datasets / 100GB",
        ],
      },
      {
        name: "Federated search",
        info: "Access to datasources like Worldbank, Kaggle, WHO, HDX and more.",
        values: ["Max 25 results", "Unlimited", "Unlimited", "Unlimited"],
      },

      {
        name: "Local Data Upload",
        info: "Bring your own data via CSV, SQL, noSQL or connect your REST services",
        values: ["5 uploads / 1GB", "Unlimited", "Unlimited", "Unlimited"],
      },

      {
        name: "Microsoft Drive data connect",
        info: "Connect data from your Microsoft Drive",
        values: ["", "available", "available", "available"],
        beta: "available",
      },
      {
        name: "Google Drive data connect",
        info: "Connect data from your Google Drive",
        values: ["", "available", "available", "available"],
        beta: "available",
      },
      {
        name: "Data export (CSV)",
        info: "Export your view in a nice CSV file",
        values: [
          "Cap export 100 lines.",
          "Unlimited",
          "Unlimited",
          "Unlimited",
        ],
        beta: "Unlimited",
      },
      {
        name: "Availability",
        info: "How long Dataxplorer will keep your assets",
        values: ["180 days", "Unlimited", "Unlimited", "Unlimited"],
        beta: "Unlimited",
      },
    ],
  },
  {
    title: "Create charts",
    subtitle:
      "Create charts for impact with ease using our comprehensive Chartbuilder..",
    color: "rgba(223, 227, 229, 0.50)",
    icon: AddChartIcon,
    options: [
      {
        name: "Access to the Chartbuilder",
        info: "Create charts from your datasets",
        values: ["available", "available", "available", "available"],
      },
      {
        name: "Number of charts",
        info: "The amount of charts you can manage.",
        values: [10, 500, "5.000", "50.000"],
        beta: "Unlimited",
      },
      {
        name: "Custom Charting",
        info: "",
        values: ["coming", "coming", "coming", "coming"],
      },
      {
        name: "Basic Charting",
        values: ["available", "available", "available", "available"],
      },
      {
        name: "Advanced Charting",
        info: "Advanced charting all CB charting features",
        values: ["", "coming", "coming", "coming"],
      },
      {
        name: "AI Agent",
        info: "Use AI Agent to help you chart",
        values: ["", "available", "available", "available"],
        beta: "available",
      },
      {
        name: "Custom branding on charts",
        info: "Custom branding on charts",
        values: ["", "available", "available", "available"],
        beta: "available",
      },
    ],
  },
  {
    title: "Create story",
    subtitle:
      "Create comprehensive stories effortlessly with our versatile story creation tools.",
    color: "#E492BD",
    icon: StoryIcon,
    options: [
      {
        name: "Number of stories",
        info: "The amount of stories you can manage.",
        values: [3, 100, "1.000", "10.000"],
        beta: "Unlimited",
      },
      {
        name: "Template Access",
        info: "Access to Basic templates",
        values: ["available", "available", "available", "available"],
      },
      {
        name: "Media / Video support",
        info: "Add images and video",
        values: ["available", "available", "available", "available"],
      },
      {
        name: "Story AI Chat",
        info: "Talk to your data",
        button: true,
        values: ["coming", "coming", "coming", "coming"],
      },
      {
        name: "Story AI Builder",
        info: "Use AI Agent to draft your Story",
        button: true,
        values: ["coming", "coming", "coming", "coming"],
      },
    ],
  },
  {
    title: "User management",
    subtitle: "Manage your users effectively with our robust user management.",
    color: "#6061E5",
    icon: UserShieldIcon,
    options: [
      {
        name: "User Management",
        values: [1, 1, 5, 100],
      },
      {
        name: "Team Management",
        values: ["", "", "available", "available"],
      },
    ],
  },
  {
    title: "Support",
    subtitle:
      "Get comprehensive support to ensure your success with our dedicated resources.",
    color: "#63A7E4",
    icon: SupportIcon,
    options: [
      {
        name: "Ticketing support",
        info: "Access to a ticketing system",
        values: ["", "available", "available", "available"],
      },
      {
        name: "Webinars",
        info: "Access to monthly webinars",
        values: ["", "available", "available", "available"],
      },
      {
        name: "Live chat",
        info: "Chat with support",
        values: ["", "available", "available", "available"],
      },
      {
        name: "Dedicated support",
        info: "Dedicated support only",
        values: ["", "", "5/8 CET", "Custom"],
      },
      {
        name: "Service Level Agreement",
        info: "Custom Service Level",
        values: ["", "", "", "5/8 CET"],
      },
    ],
  },
];
