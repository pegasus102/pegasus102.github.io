import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// --- Reusable Components ---

const NavLink = ({ children, href = "#", isScrolled, onClick }) => {
    const textColor = isScrolled ? 'text-white' : 'text-black dark:text-white';
    const underlineColor = isScrolled ? 'bg-white' : 'bg-teal-400';
    const handleClick = (e) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };
    return (
        <a href={href} onClick={handleClick} className={`${textColor} font-extrabold text-lg group transition duration-300`}>
            {children}
            <span className={`block max-w-0 group-hover:max-w-full transition-all duration-500 h-1 ${underlineColor}`}></span>
        </a>
    );
};


// --- Data for New Projects Page ---
const softwareProjectsData = [
    {
        title: 'Deep Convolutional Generative Adversarial Network',
        description: 'Worked in a team of 4 on a project involving DCGANs for realistic image generation.',
        imageUrl: 'https://placehold.co/600x400/164e63/f0f9ff?text=DCGANs',
        tags: ['Python', 'TensorFlow', 'Large Dataset', 'Keras', 'Numpy'],
        url: '#'
    },
    {
        title: 'Enhancement on Meta\'s Research',
        description: 'Achieved object goal navigation through Goal-Oriented Semantic Exploration, combining semantic mapping, policy learning, and efficient path planning.',
        imageUrl: 'https://placehold.co/600x400/164e63/f0f9ff?text=Meta+Research',
        tags: ['Path Planning', 'Computer Vision', 'RL', 'Simulator', 'Robotics'],
        url: '#'
    },
    {
        title: 'E-commerce Platform',
        description: 'A full-stack e-commerce site with user authentication, product catalog, shopping cart, and payment integration using Stripe.',
        imageUrl: 'https://placehold.co/600x400/164e63/f0f9ff?text=E-commerce',
        tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API'],
        url: '#'
    }
];

const hardwareProjectsData = [
    {
        title: 'Visual Tracking Unmanned Vehicle - Mambo Drone',
        description: 'Developed a low-cost mini drone using vision-based control and model-based software design, with rigorous testing and MATLAB-based implementation.',
        imageUrl: 'https://placehold.co/600x400/164e63/f0f9ff?text=Mambo+Drone',
        tags: ['Sensor Fusion', 'Control Systems', 'Kalman Filter', 'Perception', 'Matlab'],
        url: '#'
    },
    {
        title: 'Automated Hydroponics System',
        description: 'Designed and built an IoT-based hydroponics system using Raspberry Pi to monitor and control nutrient levels, pH, and lighting for optimal plant growth.',
        imageUrl: 'https://placehold.co/600x400/164e63/f0f9ff?text=Hydroponics',
        tags: ['Raspberry Pi', 'IoT', 'Python', 'Sensors', 'Automation'],
        url: '#'
    },
     {
        title: 'Smart Robotic Arm',
        description: 'Constructed a 4-axis robotic arm with computer vision capabilities to identify, pick up, and sort objects based on color and shape.',
        imageUrl: 'https://placehold.co/600x400/164e63/f0f9ff?text=Robotic+Arm',
        tags: ['Arduino', 'C++', 'Computer Vision', 'Servos', '3D Printing'],
        url: '#'
    }
];

// --- Data for New Blog Page ---
const blogPostsData = [
    {
        title: "Mastering React Hooks: A Deep Dive",
        excerpt: "An in-depth guide to understanding and effectively using React Hooks for state management and side effects in your applications.",
        imageUrl: "https://placehold.co/600x400/164e63/f0f9ff?text=React+Hooks",
        date: "October 18, 2025",
        readingTime: "12 min read",
        url: "#"
    },
    {
        title: "The Rise of Serverless Architecture",
        excerpt: "Exploring the benefits, drawbacks, and real-world use cases of serverless computing and how it's changing the landscape of web development.",
        imageUrl: "https://placehold.co/600x400/164e63/f0f9ff?text=Serverless",
        date: "September 28, 2025",
        readingTime: "8 min read",
        url: "#"
    },
    {
        title: "A Guide to 3D Web Graphics with Three.js",
        excerpt: "Learn the fundamentals of creating stunning, interactive 3D visualizations in the browser using the popular Three.js library.",
        imageUrl: "https://placehold.co/600x400/164e63/f0f9ff?text=Three.js",
        date: "September 5, 2025",
        readingTime: "15 min read",
        url: "#"
    }
];

// --- Custom Hooks ---
const useFadeIn = () => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0]) {
                    setIsVisible(entries[0].isIntersecting);
                }
            },
            { threshold: 0.1 }
        );
        
        const currentRef = domRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.disconnect();
            }
        };
    }, []);

    const animationClasses = `transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
    }`;

    return [domRef, animationClasses];
};

const useMousePosition = () => {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    useEffect(() => {
        const setFromEvent = (e) => setPosition({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", setFromEvent);
        return () => {
            window.removeEventListener("mousemove", setFromEvent);
        };
    }, []);
    return position;
};


// --- Custom Cursor ---
const CustomCursor = ({ theme }) => {
    const { x, y } = useMousePosition();
    const cursorUrl = theme === 'dark' ? '/cursor-white.svg' : '/cursor-black.svg';

    return (
        <div 
            style={{ 
                left: `${x}px`, 
                top: `${y}px`,
                backgroundImage: `url(${cursorUrl})`
            }} 
            className="fixed w-8 h-8 pointer-events-none z-50 bg-contain bg-center bg-no-repeat transform -translate-x-1/2 -translate-y-1/2"
        />
    );
};


// --- New Components for Projects Page ---

const ProjectDisplayCard = ({ title, description, imageUrl, tags, url }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="rounded-2xl overflow-hidden shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col bg-white dark:bg-slate-800 group">
        <div className="w-full h-48 overflow-hidden">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/1e293b/94a3b8?text=Image+Error'; }} />
        </div>
        <div className="p-6 flex-grow flex flex-col">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-teal-500 transition-colors">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{description}</p>
            <div className="flex flex-wrap gap-2 pt-2">
                {tags.map(tag => (
                    <span key={tag} className="bg-gray-200 dark:bg-slate-700 text-teal-800 dark:text-teal-300 text-sm font-semibold px-3 py-1 rounded-full">{tag}</span>
                ))}
            </div>
        </div>
    </a>
);

const ProjectsPage = () => {
    const [activeTab, setActiveTab] = useState('software');

    const TabButton = ({ tabName, children }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-6 py-2 text-lg font-semibold rounded-md transition-colors duration-300 ${
                activeTab === tabName
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-slate-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
            }`}
        >
            {children}
        </button>
    );

    return (
        <main className="flex-grow pt-24 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-6xl font-bold text-center mb-8 text-slate-800 dark:text-white">Projects.</h1>
                <div className="flex justify-center gap-4 mb-12">
                    <TabButton tabName="software">Software</TabButton>
                    <TabButton tabName="hardware">Hardware</TabButton>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(activeTab === 'software' ? softwareProjectsData : hardwareProjectsData).map(project => (
                        <ProjectDisplayCard key={project.title} {...project} />
                    ))}
                </div>
            </div>
        </main>
    );
};

// --- New Components for Blog Page ---
const BlogPostCard = ({ title, excerpt, imageUrl, date, readingTime, url }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-teal-500/20 group">
        <div className="w-full h-56 overflow-hidden">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/1e293b/94a3b8?text=Blog+Post'; }} />
        </div>
        <div className="p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{date} &bull; {readingTime}</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-teal-500 transition-colors">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{excerpt}</p>
        </div>
    </a>
);

const BlogPage = () => (
    <main className="flex-grow pt-24 min-h-screen">
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-6xl font-bold text-center mb-12 text-slate-800 dark:text-white">Blog.</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPostsData.map(post => <BlogPostCard key={post.title} {...post} />)}
            </div>
        </div>
    </main>
);

// --- New Night Sky Background Component ---
const NightSkyBackground = () => {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        const generatedStars = [];
        const nightskyColors = ["#280F36", "#632B6C", "#BE6590", "#FFC1A0", "#FE9C7F"]; 

        const getRandom = (min, max) => Math.random() * (max - min) + min;

        const numStarsType1 = 50, numStarsType2 = 20, numStarsType3 = 10, numStarsType4 = 30, numStarsType5 = 15, numStarsType6 = 5;  

        for (let i = 0; i < numStarsType1; i++) {
             generatedStars.push({ type: 'star-1 blink', top: getRandom(0, 40), left: getRandom(0, 100), duration: getRandom(2, 5) });
             generatedStars.push({ type: 'star-2 blink', top: getRandom(20, 70), left: getRandom(0, 100), duration: getRandom(4, 8) });
        }
        for (let i = 0; i < numStarsType2; i++) {
            generatedStars.push({ type: 'star-0', top: getRandom(0, 50), left: getRandom(0, 100), duration: getRandom(1, 2.5) });
            generatedStars.push({ type: 'star-1', top: getRandom(0, 50), left: getRandom(0, 100), duration: getRandom(2.5, 4) });
            generatedStars.push({ type: 'star-2 blink', top: getRandom(0, 50), left: getRandom(0, 100), duration: getRandom(4, 5) });
        }
        for (let i = 0; i < numStarsType3; i++) {
            generatedStars.push({ type: 'star-0', top: getRandom(40, 75), left: getRandom(0, 100), duration: getRandom(1, 3) });
            generatedStars.push({ type: 'star-1', top: getRandom(40, 75), left: getRandom(0, 100), duration: getRandom(2, 4) });
        }
        for (let i = 0; i < numStarsType4; i++) {
             generatedStars.push({ type: 'star-0', top: getRandom(0, 100), left: getRandom(0, 100), duration: getRandom(1, 2) });
             generatedStars.push({ type: 'star-1 blink', top: getRandom(0, 100), left: getRandom(0, 100), duration: getRandom(2, 5) });
             generatedStars.push({ type: 'star-2', top: getRandom(0, 100), left: getRandom(0, 100), duration: getRandom(1, 4) });
             generatedStars.push({ type: 'star-4 blink', top: getRandom(0, 70), left: getRandom(0, 100), duration: getRandom(5, 7) });
        }
        for (let i = 0; i < numStarsType5; i++) {
             generatedStars.push({ type: 'star-4 blink', top: getRandom(0, 100), left: getRandom(0, 100), duration: getRandom(5, 7) });
        }
        for (let i = 0; i < numStarsType6; i++) {
            if (i % 2 === 0) {
                 generatedStars.push({ type: 'star-5', top: getRandom(0, 50), left: getRandom(0, 100), duration: getRandom(5, 7), color: nightskyColors[Math.floor(getRandom(0, nightskyColors.length))] });
            }
        }
        
        setStars(generatedStars);
    }, []);

    return (
        <div className="sky">
            <div className="mountains">
                <div className="mountain-1"></div>
                <div className="mountain-2"></div>
                <div className="land-1"></div>
                <div className="land-2"></div>
                <div className="land-3"></div>
            </div>
            <div className="mountains-base"></div>
            <div className="light-base"></div>
            <div className="stars">
                {stars.map((star, i) => (
                    <div key={i} className={`star ${star.type}`} style={{ top: `${star.top}vh`, left: `${star.left}vw`, animationDuration: `${star.duration}s`, backgroundColor: star.color }}></div>
                ))}
            </div>
        </div>
    );
};

// --- Page Sections / Components ---

const Header = ({ isScrolled, handleNavigation, currentPage, theme, toggleTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const baseClasses = "fixed top-0 left-0 right-0 z-20 transition-all duration-300";
    const scrolledClasses = "bg-teal-500 shadow-lg py-3";
    const topClasses = "bg-stone-50 bg-opacity-90 backdrop-blur-sm py-4 dark:bg-transparent";

    const isDarkBg = isScrolled || isMenuOpen;
    
    const dynamicTextClass = isDarkBg ? 'text-white' : 'text-black dark:text-white';
    const dynamicBorderClass = isDarkBg ? 'border-white' : 'border-black dark:border-white';
    
    const navLinkHandler = (navFunction) => {
        setIsMenuOpen(false);
        navFunction();
    };

    const handleNavClick = (sectionId) => {
        if (currentPage !== 'home') {
            handleNavigation('home', { sectionId });
        } else {
             document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    const handleLogoClick = (e) => {
        e.preventDefault();
        setIsMenuOpen(false);
        if (currentPage !== 'home') {
            handleNavigation('home');
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    const SunIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );

    const MoonIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
    );

    const MenuIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );

    const CloseIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
    
    const navLinks = (
      <>
        <NavLink onClick={() => navLinkHandler(() => handleNavClick('about'))} isScrolled={isScrolled || isMenuOpen}>ABOUT</NavLink>
        <NavLink onClick={() => navLinkHandler(() => handleNavClick('education'))} isScrolled={isScrolled || isMenuOpen}>EDUCATION</NavLink>
        <NavLink onClick={() => navLinkHandler(() => handleNavigation('projects'))} isScrolled={isScrolled || isMenuOpen}>PROJECTS</NavLink>
        <NavLink onClick={() => navLinkHandler(() => handleNavClick('skills'))} isScrolled={isScrolled || isMenuOpen}>SKILLS</NavLink>
        <NavLink onClick={() => navLinkHandler(() => handleNavClick('certificates'))} isScrolled={isScrolled || isMenuOpen}>CERTIFICATES</NavLink>
        <NavLink onClick={() => navLinkHandler(() => handleNavigation('blog'))} isScrolled={isScrolled || isMenuOpen}>BLOG</NavLink>
        <NavLink onClick={() => navLinkHandler(() => handleNavigation('contact', { message: "Hey Siddharth, I am reaching out about potential opportunities that align with your skillset. I'd like to have your CV for discussing potential fits."}))} isScrolled={isScrolled || isMenuOpen}>CV</NavLink>
      </>
    );

    return (
        <header className={`${baseClasses} ${isScrolled ? scrolledClasses : (isMenuOpen ? 'bg-teal-500' : topClasses)}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className={`border-[3px] rounded-md ${dynamicBorderClass} px-2 py-1 transition-colors duration-300`}>
                    <a href="#" onClick={handleLogoClick} className={`text-2xl font-bold ${dynamicTextClass} transition-colors duration-300`}>SID</a>
                </div>

                <nav className="hidden md:flex items-center space-x-5">
                    {navLinks}
                </nav>
                
                <div className="hidden md:flex items-center gap-4">
                    <button onClick={toggleTheme} className={`${dynamicTextClass} p-2 rounded-full focus:outline-none`}>
                        {theme === 'light' ? <MoonIcon/> : <SunIcon/>}
                    </button>
                    <button onClick={() => handleNavigation('contact')} className={`border-[3px] rounded-md ${dynamicBorderClass} px-6 py-2 font-semibold ${dynamicTextClass} transition-colors duration-300 ${isDarkBg ? 'hover:bg-white hover:text-teal-500' : 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-slate-900'}`}>
                        Contact Me
                    </button>
                </div>

                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`${dynamicTextClass} p-2 focus:outline-none`}>
                        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>
            
            {isMenuOpen && (
                <div className="md:hidden bg-teal-500 absolute top-full left-0 w-full">
                    <nav className="flex flex-col items-center space-y-6 py-8">
                       {navLinks}
                       <div className="flex items-center gap-4 pt-4">
                           <button onClick={toggleTheme} className="text-white p-2 rounded-full focus:outline-none">
                               {theme === 'light' ? <MoonIcon/> : <SunIcon/>}
                           </button>
                           <button onClick={() => navLinkHandler(() => handleNavigation('contact'))} className="border-[3px] rounded-md border-white px-6 py-2 font-semibold text-white hover:bg-white hover:text-teal-500 transition-colors duration-300">
                               Contact Me
                           </button>
                       </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

const Hero = () => (
    <section className="pt-32 pb-16 flex justify-center items-center min-h-screen">
        <div className="relative group">
            <div className="absolute inset-0 bg-teal-400 rounded-full transform -rotate-12 transition-all duration-500 group-hover:rotate-0 group-hover:scale-105"></div>
            <div className="relative p-2 bg-slate-800 rounded-full">
                 <img
                    src="/Sid1.jpg"
                    alt="Profile of SID"
                    className="w-64 h-64 md:w-96 md:h-96 rounded-full object-cover border-4 border-white"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/320x320/e2e8f0/334155?text=SID'; }}
                />
            </div>
        </div>
    </section>
);

const AboutSection = () => {
    const [ref, classes] = useFadeIn();
    return (
        <section id="about" ref={ref} className={`container mx-auto px-6 py-24 text-center ${classes}`}>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-4xl mx-auto text-slate-800 dark:text-white">
                Hey, I'm <span className="text-teal-500">Siddharth Shankar Mahapatra</span>. Here, you can
                check out what I'm working on. I try my best to create things with passion and heart.
            </h1>
        </section>
    );
};

const featuredProjects = [
    {
        title: 'Join the Animal Alliance',
        description: 'Non-profit organization dedicated to animal welfare.',
        imageUrl: 'https://placehold.co/600x400/334155/e2e8f0?text=Animal+Alliance',
        barColor: 'bg-teal-500'
    },
    {
        title: 'Easy EMDR',
        description: 'All-in-one Solutions for your EMDR practice',
        imageUrl: 'https://placehold.co/600x400/334155/e2e8f0?text=Easy+EMDR',
        barColor: 'bg-purple-500'
    },
    {
        title: 'Browse Mega Corps',
        description: 'Website to browse corporations and their subsidiaries.',
        imageUrl: 'https://placehold.co/600x400/334155/e2e8f0?text=Mega+Corps',
        barColor: 'bg-indigo-500'
    }
];

const FeaturedProjectCard = ({ title, description, imageUrl, barColor }) => (
    <a href="#" target="_blank" rel="noopener noreferrer" className="block rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1 group">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/334155/e2e8f0?text=Error'; }}/>
        <div className={`p-4 ${barColor} transition-all duration-300 group-hover:brightness-110`}>
            <h3 className="text-white font-bold text-xl">{title}</h3>
        </div>
    </a>
);

const FeaturedWorkSection = () => {
    const [ref, classes] = useFadeIn();
    return (
        <section id="featured-work" ref={ref} className={`py-20 bg-slate-900 dark:bg-slate-800 ${classes}`}>
            <div className="container mx-auto px-6">
                <h2 className="text-5xl font-bold mb-12 text-center text-white">Featured Work</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProjects.map(project => <FeaturedProjectCard key={project.title} {...project} />)}
                </div>
            </div>
        </section>
    );
};


const educationData = [
    {
        degree: ['B.Tech in Electronics and Instrumentation '],
        university: 'Odisha Univeristy of Technology and Research, Bhubaneswar',
        years: '2023 - 2027',
        achievements: ['Focused on AI, Hardware Prototyping and Data Analytics.', 'Member of Alumni Relations Cell.']
    },
    {
        degree: 'Higher Secondary Education',
        university: 'DAV PUBLIC SCHOOL Pokhariput, Bhubaneswar',
        years: '2021 - 2023',
        achievements: ['Achieved 96.2%.', 'Scholar Distinction Awardee.']
    }
];

const EducationSection = () => {
    const [ref, classes] = useFadeIn();
    return (
        <section id="education" ref={ref} className={`py-20 bg-gray-100 dark:bg-slate-800 ${classes}`}>
            <div className="container mx-auto px-6">
                <h2 className="text-5xl font-bold mb-4 text-center text-slate-900 dark:text-white">Education</h2>
                <p className="text-center text-gray-600 dark:text-gray-300 text-lg mb-16">WHAT I HAVE STUDIED SO FAR</p>
                <div className="relative max-w-3xl mx-auto">
                    <div className="absolute left-5 top-5 h-full w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                    {educationData.map((edu) => (
                        <div key={edu.degree} className="relative pl-20 pb-12">
                            <div className="absolute left-5 top-5 transform -translate-x-1/2 w-11 h-11 bg-white dark:bg-slate-700 border-2 border-teal-500 dark:border-teal-400 rounded-full flex items-center justify-center">
                               <svg className="w-6 h-6 text-teal-500 dark:text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-md border border-gray-200 dark:border-slate-700">
                                <span className="text-teal-500 font-semibold block mb-2">{edu.years}</span>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{edu.degree}</h3>
                                <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">{edu.university}</h4>
                                <ul className="list-disc list-inside font-regular text-gray-500 dark:text-gray-300 space-y-2">
                                    {edu.achievements.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const skills = ['C Programming','Python','JavaScript (ES6+)', 'React', 'Node.js', 'Tailwind CSS', 'Linux', 'Firebase', 'HTML5 & CSS3',  'Hardware Prototyping', 'Arduino',  'Git & GitHub'];

const SkillBadge = ({ skill }) => <div className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 font-semibold py-2 px-4 rounded-full shadow-sm">{skill}</div>;

const SkillsSection = () => {
    const [ref, classes] = useFadeIn();
    return (
        <section id="skills" ref={ref} className={`py-20 bg-stone-50 dark:bg-transparent ${classes}`}>
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-5xl font-bold mb-12 text-slate-800 dark:text-white">Skills</h2>
                <div className="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto">{skills.map(skill => <SkillBadge key={skill} skill={skill} />)}</div>
            </div>
        </section>
    );
};

const certificatesData = [
    { title: 'Google Professional Cloud Architect', issuer: 'Google Cloud', date: 'Issued Aug 2024', url: '#' },
    { title: 'React - The Complete Guide', issuer: 'Udemy', date: 'Issued Jan 2023', url: '#' },
    { title: 'Certified Kubernetes Administrator (CKA)', issuer: 'The Linux Foundation', date: 'Issued May 2023', url: '#' }
];

const CertificateCard = ({ title, issuer, date, url }) => (
     <a href={url} target="_blank" rel="noopener noreferrer" className="block bg-slate-800 p-6 rounded-lg text-left shadow-lg hover:bg-slate-700 hover:-translate-y-1 transition-all duration-300">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-teal-400 font-semibold mb-3">{issuer}</p>
        <p className="text-gray-400">{date}</p>
    </a>
);

const CertificatesSection = () => {
    const [ref, classes] = useFadeIn();
    return (
        <section id="certificates" ref={ref} className={`py-20 bg-slate-900 dark:bg-slate-700 ${classes}`}>
            <div className="container mx-auto px-6">
                <h2 className="text-5xl font-bold mb-12 text-center text-white">Certificates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">{certificatesData.map(cert => <CertificateCard key={cert.title} {...cert} />)}</div>
            </div>
        </section>
    );
};

const GetInTouchSection = ({ handleNavigation }) => {
    const [ref, classes] = useFadeIn();
    return (
        <section id="contact" ref={ref} className={`py-20 bg-gray-50 dark:bg-slate-800 ${classes}`}>
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold mb-8 text-slate-800 dark:text-white">Get In Touch</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8">Have a question or want to work together? Feel free to reach out!</p>
                <button onClick={() => handleNavigation('contact')} className="bg-teal-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-600 transition-colors duration-300 text-lg">
                    Say Hello
                </button>
            </div>
        </section>
    );
};

const Footer = () => {
    const [ref, classes] = useFadeIn();
    return (
        <footer ref={ref} className={`bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-6 transition-colors duration-300 ${classes}`}>
            <div className="container mx-auto px-6 text-center">
                <div className="flex justify-center space-x-6 mb-4">
                     <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                    </a>
                </div>
                <p>&copy; 2025 SID. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

// --- 3D Globe Component for Contact Page ---
const GlobeCanvas = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const currentMount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(2.5, 64, 64);
        const material = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8, metalness: 0.3 });
        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);
        
        const rings = [];
        for (let i = 0; i < 3; i++) {
            const ringGeo = new THREE.TorusGeometry(3.5 + i * 0.3, 0.05, 16, 100);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;
            scene.add(ring);
            rings.push(ring);
        }

        const starsGeometry = new THREE.BufferGeometry();
        const starsVertices = [];
        for (let i = 0; i < 1000; i++) {
            const x = (Math.random() - 0.5) * 200;
            const y = (Math.random() - 0.5) * 200;
            const z = (Math.random() - 0.5) * 200;
            if(x*x + y*y + z*z > 100*100) starsVertices.push(x, y, z);
        }
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
        const starField = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starField);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1.5);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        camera.position.z = 8;
        
        const animate = () => {
            requestAnimationFrame(animate);
            globe.rotation.y += 0.001;
            starField.rotation.y += 0.0002;
            rings.forEach((ring, index) => {
                ring.rotation.x += 0.0005 * (index + 1);
                ring.rotation.y += 0.0008 * (index + 1);
            });
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };
        
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            currentMount.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} className="w-full h-full min-h-[400px] md:min-h-0" />;
};

// --- Contact Page Component ---
const ContactPage = ({ contactMessage }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: contactMessage || '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    // IMPORTANT: Access the key from environment variables
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };
    
    useEffect(() => {
        setFormData(prev => ({...prev, message: contactMessage}))
    }, [contactMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = {
            ...formData,
            access_key: accessKey,
            subject: `New message from ${formData.name}`,
        };

        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (result.success) {
                setShowNotification(true);
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setShowNotification(false), 4000);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex-grow bg-slate-900 text-white min-h-screen flex items-center">
            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <p className="text-teal-400 font-semibold mb-2">GET IN TOUCH</p>
                        <h1 className="text-6xl font-bold mb-8">Contact.</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                    <input type="text" id="name" placeholder="Your name" value={formData.name} onChange={handleInput} required className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 transition-colors" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                    <input type="email" id="email" placeholder="Your email" value={formData.email} onChange={handleInput} required className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 transition-colors" />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                                <textarea id="message" rows="5" value={formData.message} onChange={handleInput} required className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 transition-colors"></textarea>
                            </div>
                            <div>
                                <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-500">
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                                {showNotification && (
                                    <div className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-pulse">
                                        Message Sent Successfully!
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                    <div className="h-full w-full relative">
                         <GlobeCanvas />
                    </div>
                </div>
            </div>
        </main>
    );
};

// --- HomePage Wrapper ---
const HomePage = ({ handleNavigation }) => (
    <>
        <main className="flex-grow">
            <Hero />
            <AboutSection />
            <EducationSection />
            <FeaturedWorkSection />
            <SkillsSection />
            <CertificatesSection />
            <GetInTouchSection handleNavigation={handleNavigation} />
        </main>
    </>
);

// --- Loading Screen Component ---
const LoadingScreen = () => (
    <div className="fixed inset-0 bg-stone-50 dark:bg-slate-900 flex justify-center items-center z-50">
        <l-reuleaux
            size="45"
            stroke="5"
            stroke-length="0.15"
            bg-opacity="0.1"
            speed="1.2"
            color="#14b8a6"
        ></l-reuleaux>
    </div>
);


// --- Main App Component ---
export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [page, setPage] = useState('home');
    const [theme, setTheme] = useState('light');
    const [contactMessage, setContactMessage] = useState("Hey Siddharth, I am reaching out about potential opportunities that align with your skillset. I'd like to have your CV for discussing potential fits.");
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        // Check for touch device
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        
        // Simulate initial loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Hide after 2 seconds

        return () => clearTimeout(timer);
    }, []);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    
    const handleNavigation = (targetPage, options = {}) => {
        const { message, sectionId } = options;
        const defaultMessage = "Hey Sid, love the website! I'd like to chat about some opportunities you might like!";

        if (message) {
            setContactMessage(message);
        } else if (targetPage === 'contact') {
            setContactMessage(defaultMessage);
        }
        
        setPage(targetPage);

        if (targetPage === 'home') {
            setTimeout(() => {
                if (sectionId) {
                    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 100);
        }
    };


    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);
    
    useEffect(() => {
        const threeScript = document.createElement('script');
        threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        threeScript.async = true;
        document.body.appendChild(threeScript);
        
        const ldrsScript = document.createElement('script');
        ldrsScript.type = 'module';
        ldrsScript.src = 'https://cdn.jsdelivr.net/npm/ldrs/dist/auto/reuleaux.js';
        document.body.appendChild(ldrsScript);

        const fontLink1 = document.createElement('link');
        fontLink1.rel = 'preconnect';
        fontLink1.href = 'https://fonts.googleapis.com';
        document.head.appendChild(fontLink1);

        const fontLink2 = document.createElement('link');
        fontLink2.rel = 'preconnect';
        fontLink2.href = 'https://fonts.gstatic.com';
        fontLink2.crossOrigin = 'true';
        document.head.appendChild(fontLink2);

        const fontLink3 = document.createElement('link');
        fontLink3.href = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Poppins:ital,wght@0,400;0,700;0,800;1,100&display=swap';
        fontLink3.rel = 'stylesheet';
        document.head.appendChild(fontLink3);

        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.innerHTML = `
            body {
                font-family: 'Poppins', sans-serif;
            }
            ${!isTouchDevice ? '.cursor-none, .cursor-none * { cursor: none !important; }' : ''}
            .sky { position: fixed; height: 100vh; width: 100vw; background: #060010; background: linear-gradient( to bottom, #060010 0%, #060010 6%, #090016 11%, #070016 20%, #0a0121 48%, #0a0127 55%, #0a0129 57%, #0c012b 62%, #0e0131 68%, #0d012f 69%, #18023c 78%, #19023e 79%, #19023e 79%, #1c0242 81%, #22034b 85%, #2e045a 92%, #2f045e 96%, #340464 98%, #370569 100% ); z-index: -1; }
            .mountains { position: absolute; height: 80px; width: 100%; bottom: 0px; left: 0px; z-index: 2; }
            .light-base { 
                position: absolute; 
                bottom: -80px; 
                left: 10vw; 
                width: 80vw; 
                height: 100px; 
                border-radius: 50%; 
                box-shadow: -0px -8px 20px 8px #0ff5, /* Faint Neon Cyan */
                            -0px -15px 30px 15px #0af5, /* Faint Lighter Cyan */
                            -0px -20px 40px 20px #a0f5, /* Faint Bright Purple */
                            -0px -30px 80px 40px #50f5; /* Faint Deeper Blue/Purple */
                background-color: #0ff5; /* Faint base color for the glow */
                z-index: 1; 
            }
            .mountains-base { content: ""; background: linear-gradient( to bottom, rgba(55, 5, 105, 0) 0%, rgba(9, 0, 22, 1) 100% ); width: 100%; height: 100px; position: absolute; bottom: -10px; z-index: 3; }
            .mountains > [class^="mountain"], .mountains > [class^="land"] { background: #110124; box-shadow: 0px 0px 50px 5px rgba(255, 255, 255, 0.2); position: absolute; bottom: 0px; }
            .mountain-2 { width: 60px; height: 60px; bottom: -20px !important; left: -10px; transform: rotate(45deg); border-top-left-radius: 10px; }
            .mountain-1 { width: 100px; height: 100px; bottom: -40px !important; left: 10px; transform: rotate(45deg); border-top-left-radius: 10px; }
            .land-1 { width: 30%; height: 20px; border-top-right-radius: 100%; }
            .land-2 { width: 60%; height: 15px; left: 30%; border-top-left-radius: 200%; border-top-right-radius: 200%; }
            .land-3 { width: 20%; height: 20px; left: 80%; border-top-left-radius: 100%; }
            .stars { position: absolute; top: 0px; left: 0px; width: 100vw; height: 100vh; }
            .star { position: absolute; border-radius: 50%; background-color: white; opacity: 0.8; }
            .blink { animation: blink ease-in-out infinite; }
            @keyframes blink { 50% { opacity: 0; } }
            .star-0 { height: 0.5px; width: 0.5px; }
            .star-1 { height: 1px; width: 1px; }
            .star-2 { height: 1.5px; width: 1.5px; }
            .star-3 { height: 2px; width: 2px; }
            .star-4 { height: 2.5px; width: 2.5px; box-shadow: 0px 0px 6px 1px rgba(255,255,255,0.5); }
            .star-5 { height: 2.5px; width: 2.5px; box-shadow: 0px 0px 6px 1px rgba(255,255,255,0.7); }
        `;
        document.head.appendChild(style);

        return () => {
            if(document.body.contains(threeScript)) document.body.removeChild(threeScript);
            if(document.body.contains(ldrsScript)) document.body.removeChild(ldrsScript);
            if(document.head.contains(style)) document.head.removeChild(style);
            if(document.head.contains(fontLink1)) document.head.removeChild(fontLink1);
            if(document.head.contains(fontLink2)) document.head.removeChild(fontLink2);
            if(document.head.contains(fontLink3)) document.head.removeChild(fontLink3);
        }
    },[isTouchDevice]);

    const renderPage = () => {
        switch(page) {
            case 'home':
                return <HomePage handleNavigation={handleNavigation} />;
            case 'projects':
                return <ProjectsPage />;
            case 'blog':
                return <BlogPage />;
            case 'contact':
                return <ContactPage contactMessage={contactMessage} key={contactMessage} />;
            default:
                return <HomePage handleNavigation={handleNavigation} />;
        }
    };
    
    return (
        <div className={`flex flex-col min-h-screen transition-colors duration-300 bg-stone-50 dark:bg-transparent ${!isTouchDevice ? 'cursor-none' : ''}`} style={{ scrollBehavior: 'smooth' }}>
            {theme === 'dark' && <NightSkyBackground />}
            {isLoading ? <LoadingScreen /> : (
                <>
                    {!isTouchDevice && <CustomCursor theme={theme} />}
                    <Header isScrolled={isScrolled} handleNavigation={handleNavigation} currentPage={page} theme={theme} toggleTheme={toggleTheme} />
                    {renderPage()}
                    {page !== 'contact' && <Footer />}
                </>
            )}
        </div>
    );
}