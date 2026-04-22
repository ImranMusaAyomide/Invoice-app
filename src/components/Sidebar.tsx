import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import profilePic from "@/assets/Oval.svg";
import logo from "@/assets/logo.svg";

const Sidebar = () => {
  const { theme, toggle } = useTheme();

  return (
    <aside
      className="
        fixed z-40 flex bg-sidebar
        inset-x-0 top-0 h-[72px] flex-row items-stretch
        md:inset-x-0 md:top-0 md:h-20
        lg:inset-y-0 lg:left-0 lg:right-auto lg:h-screen lg:w-[103px] lg:flex-col lg:rounded-r-3xl
      "
      aria-label="Primary"
    >
      {/* Logo block with brand bg */}
      <a
        href="/"
        className="
          relative flex items-center justify-center overflow-hidden bg-brand
          h-full w-[72px] rounded-r-2xl
          md:w-20 md:rounded-r-3xl
          lg:h-[103px] lg:w-full lg:rounded-r-3xl
          transition-colors hover:bg-brand-hover
        "
        aria-label="Invoices home"
      >
        <span className="absolute inset-y-0 right-0 w-1/2 rounded-tl-2xl bg-brand-hover lg:rounded-tl-3xl" />
        <span className="relative">
          <img src={logo} alt="Invoice Buddy logo" className="h-7 w-7" />
        </span>
      </a>

      {/* Right cluster: theme + avatar */}
      <div className="ml-auto flex items-center gap-5 px-6 lg:ml-0 lg:mt-auto lg:flex-col lg:gap-6 lg:px-0 lg:pb-6">
        <button
          onClick={toggle}
          className="text-subtle transition-colors hover:text-foreground dark:hover:text-white"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>
        <div className="hidden h-px w-full bg-[#494E6E] lg:block" aria-hidden="true" />
        <div className="ml-2 lg:ml-0">
          <img src={profilePic} alt="User profile" className="h-10 w-10 rounded-full object-cover" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
