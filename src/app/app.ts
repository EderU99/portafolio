import { Component, OnInit, OnDestroy, signal } from '@angular/core';

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
export class App implements OnInit, OnDestroy {
  protected readonly mobileMenuOpen = signal(false);

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
    'Especialista en Infraestructura & Cloud M365',
    'Soporte Técnico Nivel 1 / Nivel 2 & Seguridad',
  ];
  private roleIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private typewriterTimer?: ReturnType<typeof setTimeout>;
  private loaderInterval?: ReturnType<typeof setInterval>;

  protected readonly nameLetters = 'EDER UGARTE'.split('');

  protected readonly profile = {
    name: 'Eder Ugarte',
    role: 'Desarrollador de Software Multiplataforma',
    secondaryRole: 'Especialista en Infraestructura & Soporte TI',
    degree: 'Técnico Superior Universitario en Desarrollo de Software Multiplataforma',
    shortBio:
      'Combino el desarrollo de aplicaciones web modernas con una sólida experiencia en infraestructura tecnológica, administración de servicios en la nube (Microsoft 365) y soporte técnico especializado.',
    location: 'México',
    email: 'contacto@ederugarte.dev',
    github: 'https://github.com/EderU99',
    linkedin: 'https://linkedin.com/',
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

  protected readonly techMarquee = [
    'Angular',
    'JavaScript ES6+',
    'HTML5 & SCSS',
    'PHP',
    'Laravel',
    'Python',
    'MySQL',
    'SQL Server',
    'MongoDB',
    'Microsoft 365',
    'Exchange Online',
    'SharePoint',
    'Bitdefender Security',
    'Soporte N1 & N2',
    'Redes & Tickets',
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
        { name: 'Bitdefender Antivirus', tag: 'Seguridad Endpoint', level: 90 },
        { name: 'Redes Básicas', tag: 'Conectividad / LAN', level: 85 },
        { name: 'Sistemas de Tickets', tag: 'Gestión SLA', level: 94 },
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

  ngOnDestroy(): void {
    if (this.typewriterTimer) clearTimeout(this.typewriterTimer);
    if (this.loaderInterval) clearInterval(this.loaderInterval);
  }

  protected replayIntro(): void {
    this.mobileMenuOpen.set(false);
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
        speed = 2200; // Pause at end of phrase
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
