import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener,
  ElementRef,
  inject,
  signal,
} from '@angular/core';

interface SkillCategory {
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
  skills: { name: string; tag?: string; level: number }[];
}

interface Project {
  title: string;
  status: string;
  statusType: 'in-progress' | 'completed' | 'upcoming';
  description: string;
  technologies: string[];
  repoUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  progress?: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);

  protected readonly mobileMenuOpen = signal(false);

  // Scroll animations & tracking state
  protected readonly scrollProgress = signal(0);
  protected readonly scrollY = signal(0);
  protected readonly activeSection = signal('inicio');
  protected readonly showBackToTop = signal(false);
  protected readonly skillsVisible = signal(false);
  protected readonly projectsVisible = signal(false);

  // Loading Splash Screen state
  protected readonly isLoading = signal(true);
  protected readonly isExitingLoader = signal(false);
  protected readonly loadProgress = signal(0);
  protected readonly loadingStatus = signal('Inicializando entorno...');

  // Interactive Terminal Tab state
  protected readonly activeTerminalTab = signal<'ts' | 'sh' | 'json'>('ts');

  // Typewriter Role state
  protected readonly typedRole = signal('');
  private readonly roles = [
    'Desarrollador de Software Multiplataforma',
    'Desarrollador Web Full Stack (Angular & Laravel)',
    'Desarrollo Asistido por IA & Agentes CLI',
    'Especialista en Infraestructura & Cloud M365',
    'Soporte Técnico Nivel 1 / Nivel 2 & Redes',
  ];
  private roleIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private typewriterTimer?: ReturnType<typeof setTimeout>;
  private loaderInterval?: ReturnType<typeof setInterval>;
  private scrollObserver?: IntersectionObserver;

  protected readonly nameLetters = 'EDER UGARTE'.split('');

  protected readonly profile = {
    name: 'Eder Ugarte',
    role: 'Desarrollador de Software Multiplataforma',
    secondaryRole: 'Especialista en Infraestructura TI & Herramientas IA',
    degree: 'Técnico Superior Universitario en Desarrollo de Software Multiplataforma',
    shortBio:
      'Combino el desarrollo de aplicaciones web modernas con una sólida experiencia en infraestructura tecnológica (Microsoft 365 & Soporte N1/N2), el uso avanzado de agentes de IA (Gemini CLI, Grok Build) y generación de video e imagen local con ComfyUI.',
    location: 'México',
    email: 'eder_daniel@live.com',
    github: 'https://github.com/EderU99',
    linkedin: 'https://www.linkedin.com/in/ederdanielugarte/',
  };

  protected readonly highlights = [
    {
      value: 'Full Stack',
      label: 'Angular, Laravel, PHP & Python',
      icon: 'code',
    },
    {
      value: 'Cloud & TI',
      label: 'Microsoft 365 & Soporte N1/N2',
      icon: 'cloud',
    },
    {
      value: 'TSU',
      label: 'Software Multiplataforma',
      icon: 'award',
    },
  ];

  protected readonly techLogos = [
    {
      name: 'Angular',
      category: 'Frontend',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg',
    },
    {
      name: 'JavaScript',
      category: 'Lenguaje',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
    },
    {
      name: 'HTML5',
      category: 'Web',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
    },
    {
      name: 'CSS3 / SCSS',
      category: 'Diseño',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
    },
    {
      name: 'PHP',
      category: 'Backend',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg',
    },
    {
      name: 'Laravel',
      category: 'Framework',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg',
    },
    {
      name: 'Python',
      category: 'Backend & Scripts',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
    },
    {
      name: 'MySQL',
      category: 'Base de Datos',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg',
    },
    {
      name: 'SQL Server',
      category: 'Base de Datos',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg',
    },
    {
      name: 'MongoDB',
      category: 'NoSQL',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg',
    },
    {
      name: 'Git & GitHub',
      category: 'Control de Versiones',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
    },
    {
      name: 'Gemini CLI',
      category: 'Agente IA & Código',
      logo: 'logos/gemini.svg',
    },
    {
      name: 'Grok Build',
      category: 'Desarrollo con IA',
      logo: 'logos/grok.svg',
    },
    {
      name: 'ComfyUI',
      category: 'IA Video & Imagen',
      logo: 'logos/comfyui.svg',
    },
  ];

  protected readonly skillCategories: SkillCategory[] = [
    {
      title: 'Desarrollo Frontend & Web',
      subtitle: 'Interfaces modernas, responsivas y animadas',
      icon: 'code',
      accent: 'cyan',
      skills: [
        { name: 'Angular', tag: 'Framework SPA', level: 90 },
        { name: 'JavaScript (ES6+)', tag: 'Lenguaje', level: 88 },
        { name: 'HTML5 Semántico', tag: 'Maquetación', level: 95 },
        { name: 'CSS3 / SCSS', tag: 'Diseño & Animación', level: 90 },
      ],
    },
    {
      title: 'Backend & Lenguajes',
      subtitle: 'Lógica de negocio, APIs REST y automatización',
      icon: 'server',
      accent: 'indigo',
      skills: [
        { name: 'PHP', tag: 'Backend', level: 85 },
        { name: 'Laravel', tag: 'Framework MVC', level: 85 },
        { name: 'Python', tag: 'Scripting & Backend', level: 82 },
      ],
    },
    {
      title: 'Bases de Datos',
      subtitle: 'Modelado relacional, consultas y NoSQL',
      icon: 'database',
      accent: 'emerald',
      skills: [
        { name: 'MySQL', tag: 'Relacional', level: 88 },
        { name: 'SQL Server', tag: 'Empresarial', level: 84 },
        { name: 'MongoDB', tag: 'NoSQL Documental', level: 80 },
      ],
    },
    {
      title: 'Infraestructura, Cloud & Soporte TI',
      subtitle: 'Administración de sistemas, seguridad y continuidad operativa',
      icon: 'shield',
      accent: 'amber',
      skills: [
        { name: 'Soporte Técnico Nivel 1 y 2', tag: 'Helpdesk / Sitio', level: 95 },
        { name: 'Microsoft 365 / Office 365', tag: 'Cloud Admin', level: 92 },
        { name: 'Exchange & SharePoint', tag: 'Colaboración', level: 88 },
        { name: 'Bitdefender (Consola Admin)', tag: 'Revisión de Alertas & Escaneos', level: 80 },
        { name: 'Redes Básicas', tag: 'Conectividad / LAN', level: 85 },
        { name: 'Sistemas de Tickets', tag: 'Gestión SLA', level: 94 },
      ],
    },
    {
      title: 'Inteligencia Artificial & Desarrollo Asistido',
      subtitle: 'Programación asistida por agentes IA (Gemini CLI, Grok Build) y flujos generativos locales con ComfyUI',
      icon: 'ai',
      accent: 'purple',
      skills: [
        { name: 'Gemini CLI (Antigravity)', tag: 'Agente de Código en Terminal', level: 92 },
        { name: 'ComfyUI (IA Local en PC)', tag: 'Generación de Video e Imágenes', level: 88 },
        { name: 'Grok Build', tag: 'Desarrollo & Prompts IA', level: 85 },
        { name: 'Ingeniería de Prompts & Flujos IA', tag: 'Optimización de Desarrollo', level: 90 },
      ],
    },
  ];

  protected readonly projects: Project[] = [
    {
      title: 'Plataforma de Gestión para Nutriólogos',
      status: 'En Desarrollo (Próximamente Demo)',
      statusType: 'in-progress',
      featured: true,
      progress: 75,
      description:
        'Sistema clínico integral para especialistas en nutrición. Incluye control de expedientes de pacientes, historial antropométrico, cálculo dietético, generación de planes alimenticios personalizados y agenda interactiva.',
      technologies: ['Angular', 'TypeScript', 'API REST', 'MySQL / SQL', 'SCSS'],
    },
    {
      title: 'Repositorios y Prácticas en GitHub (@EderU99)',
      status: 'Código Abierto',
      statusType: 'upcoming',
      featured: false,
      description:
        'Colección de sistemas web, scripts de automatización y proyectos académicos construidos con Laravel, PHP, Python, Angular y motores de bases de datos relacionales y NoSQL.',
      technologies: ['Laravel', 'PHP', 'Python', 'MySQL', 'MongoDB', 'Git'],
      repoUrl: 'https://github.com/EderU99',
    },
  ];

  ngOnInit(): void {
    this.startSplashLoader();
    this.startTypewriter();
  }

  ngAfterViewInit(): void {
    this.initScrollRevealObserver();
  }

  ngOnDestroy(): void {
    if (this.typewriterTimer) clearTimeout(this.typewriterTimer);
    if (this.loaderInterval) clearInterval(this.loaderInterval);
    if (this.scrollObserver) this.scrollObserver.disconnect();
  }

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    const winScroll = window.scrollY || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? Math.min(100, Math.max(0, (winScroll / height) * 100)) : 0;

    this.scrollY.set(winScroll);
    this.scrollProgress.set(scrolled);
    this.showBackToTop.set(winScroll > 380);

    // Update active navbar link based on scroll position
    const sections = ['inicio', 'sobre-mi', 'habilidades', 'proyectos', 'contacto'];
    for (let i = sections.length - 1; i >= 0; i--) {
      const sectionEl = document.getElementById(sections[i]);
      if (sectionEl) {
        const rect = sectionEl.getBoundingClientRect();
        if (rect.top <= 240) {
          this.activeSection.set(sections[i]);
          break;
        }
      }
    }
  }

  private initScrollRevealObserver(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.skillsVisible.set(true);
      this.projectsVisible.set(true);
      return;
    }

    this.scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add('in-view');

            if (target.id === 'habilidades' || target.closest('#habilidades')) {
              this.skillsVisible.set(true);
            }
            if (target.id === 'proyectos' || target.closest('#proyectos')) {
              this.projectsVisible.set(true);
            }
          } else {
            // Re-animate smoothly when scrolling back up/down
            if (entry.boundingClientRect.top > 0) {
              target.classList.remove('in-view');
              if (target.id === 'habilidades') {
                this.skillsVisible.set(false);
              }
              if (target.id === 'proyectos') {
                this.projectsVisible.set(false);
              }
            }
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const revealElements = this.el.nativeElement.querySelectorAll('.scroll-reveal');
    revealElements.forEach((elem: Element) => this.scrollObserver?.observe(elem));

    const skillsSection = document.getElementById('habilidades');
    if (skillsSection) this.scrollObserver.observe(skillsSection);

    const projectsSection = document.getElementById('proyectos');
    if (projectsSection) this.scrollObserver.observe(projectsSection);
  }

  protected scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected replayIntro(): void {
    this.mobileMenuOpen.set(false);
    this.scrollToTop();
    this.startSplashLoader();
  }

  private startSplashLoader(): void {
    if (this.loaderInterval) clearInterval(this.loaderInterval);
    this.isLoading.set(true);
    this.isExitingLoader.set(false);
    this.loadProgress.set(0);
    this.loadingStatus.set('Inicializando módulos del sistema...');

    let current = 0;
    this.loaderInterval = setInterval(() => {
      current += Math.floor(Math.random() * 6) + 3;
      if (current >= 100) {
        current = 100;
        this.loadProgress.set(100);
        this.loadingStatus.set('¡Portafolio de Eder Ugarte listo!');
        clearInterval(this.loaderInterval);

        setTimeout(() => {
          this.isExitingLoader.set(true);
          setTimeout(() => {
            this.isLoading.set(false);
          }, 650);
        }, 380);
      } else {
        this.loadProgress.set(current);
        if (current > 75) {
          this.loadingStatus.set('Sincronizando servicios Cloud & M365...');
        } else if (current > 45) {
          this.loadingStatus.set('Compilando componentes Angular & Full Stack...');
        } else if (current > 20) {
          this.loadingStatus.set('Cargando perfil: Eder Ugarte (TSU)...');
        }
      }
    }, 55);
  }

  private startTypewriter(): void {
    const tick = () => {
      const fullText = this.roles[this.roleIndex];

      if (this.isDeleting) {
        this.charIndex--;
        this.typedRole.set(fullText.substring(0, this.charIndex));
      } else {
        this.charIndex++;
        this.typedRole.set(fullText.substring(0, this.charIndex));
      }

      let speed = this.isDeleting ? 28 : 55;

      if (!this.isDeleting && this.charIndex === fullText.length) {
        speed = 2200;
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.roleIndex = (this.roleIndex + 1) % this.roles.length;
        speed = 400;
      }

      this.typewriterTimer = setTimeout(tick, speed);
    };

    tick();
  }

  protected setTerminalTab(tab: 'ts' | 'sh' | 'json'): void {
    this.activeTerminalTab.set(tab);
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
