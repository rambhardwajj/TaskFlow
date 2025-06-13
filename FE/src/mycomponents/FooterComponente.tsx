import { Footer } from "./Footer";
import { FiGithub, FiLinkedin,  } from "react-icons/fi";
import { FaDiscord, FaXTwitter } from "react-icons/fa6";

export default function FooterComponent() {
  const footerProps = {

    tagline: 'Tasks in Flow',
    socialLinks: [
      {
        icon: <FiGithub className="icon" />,
        href: 'https://github.com/rambhardwajj',
        label: 'GitHub',
      },
      {
        icon: <FaDiscord className="icon" />,
        href: 'https://discord.com/invite/WDrH3zuWFb',
        label: 'Discord',
      },
      {
        icon: <FaXTwitter className="icon" />,
        href: 'https://x.com/ram_101001',
        label: 'X',
      },
      {
        icon: <FiLinkedin className="icon" />,
        href: 'https://www.linkedin.com/in/bhardwajram',
        label: 'LinkedIn',
      },
      
  
    ],
    linkSections: [
    //   {
    //     title: 'Product',
    //     links: [
    //       {name: 'Courses', href: 'https://courses.TaskFlow.com/learn'},
    //       {
    //         name: 'Cohort',
    //         href: 'https://courses.TaskFlow.com/learn/view-all?show=batch&type=17',
    //       },
    //       {
    //         name: 'Coding Hero',
    //         href: 'https://courses.TaskFlow.com/learn/batch/about?bundleId=226894',
    //       },
    //       {name: 'MasterJI', href: 'https://masterji.co/login'},
    //     ],
    //   },
      {
        title: 'Resources',
        links: [
          {name: 'React Npm ', href: 'https://www.npmjs.com/package/react'},
          {name: 'ShadCn', href: 'https://ui.shadcn.com/'},
          {name: 'UIgnite', href: 'https://uignite.in/'},
        ],
      },
      {
        title: 'Legal',
        links: [
          {name: 'Terms of Service', href: '#'},
          {name: 'Privacy Policy', href: '#'},
          {name: 'Pricing Policy', href: '#'},
          {name: 'Refund Policy', href: '#'},
        ],
      },
    ],
    copyrightText: 'TaskFlow',
    builtByText: 'TaskFlow',
    socialLinksStyle: 'hover:text-orange-400',
    linkStyle: 'hover:text-orange-400 hover:text-zinc-800',
    className:"  bg-zinc-950 mt-40"
  };

  return (
      <Footer {...footerProps} />
  );
};
    