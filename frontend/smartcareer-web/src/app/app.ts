import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';

type JobMatch = {
  role: string;
  value: number;
};

type CvReviewItem = {
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'danger';
};

type CvHistoryItem = {
  id: string;
  fileName: string;
  atsScore: number;
  profileDetected: string;
  strengths: string;
  weaknesses: string;
  recommendations: string;
  createdAt: string;
};

type JobOffer = {
  id: number;
  title: string;
  company: string;
  location: string;
  modality: string;
  level: string;
  description: string;
  keywords: string[];
};

type CvExperience = {
  role: string;
  company: string;
  period: string;
  tasks: string[];
};

type CvData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  drivingLicense: string;
  headline: string;
  profile: string;
  experience: CvExperience[];
  education: string[];
  aptitudes: string[];
  languages: string[];
  certifications: string[];
  skills: {
    office: string[];
    programming: string[];
    databases: string[];
    web: string[];
    testing: string[];
    systems: string[];
    management: string[];
  };
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  private readonly apiUrl = 'http://localhost:5017/api/CvAnalysis';

  fileName = '';
  selectedFile: File | null = null;

  loading = false;
  analysisDone = false;
  applicationSimulated = false;

  candidateName = 'Candidato';
  score = 0;
  profileType = '';
  summary = '';
  coverLetterText = '';

  selectedOffer: JobOffer | null = null;

  jobOffers: JobOffer[] = [
    {
      id: 1,
      title: 'Backend .NET Junior',
      company: 'Tech Solutions Madrid',
      location: 'Madrid',
      modality: 'Híbrido',
      level: 'Junior',
      description:
        'Buscamos desarrollador junior con conocimientos en C#, ASP.NET Core, SQL Server, API REST, Git y ganas de aprender en equipo.',
      keywords: ['C#', 'ASP.NET Core', '.NET', 'SQL Server', 'API REST', 'Git', 'Postman', 'Backend']
    },
    {
      id: 2,
      title: 'Full Stack Angular Junior',
      company: 'Digital Factory',
      location: 'Remoto / España',
      modality: 'Remoto',
      level: 'Junior',
      description:
        'Oferta para perfil Full Stack Junior con Angular, TypeScript, HTML, CSS, C#, API REST, SQL Server y control de versiones con Git.',
      keywords: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'C#', 'API REST', 'SQL Server', 'Git']
    },
    {
      id: 3,
      title: 'QA Tester Junior Técnico',
      company: 'Banking Software Lab',
      location: 'Madrid',
      modality: 'Híbrido',
      level: 'Junior',
      description:
        'Se busca QA Tester Junior con base técnica en Java, JUnit, pruebas funcionales, SQL Developer, DBeaver, documentación y validación de datos.',
      keywords: ['QA', 'Testing', 'Java', 'JUnit', 'JPA', 'SQL Developer', 'DBeaver', 'JMeter']
    },
    {
      id: 4,
      title: 'Soporte Técnico con Desarrollo',
      company: 'Enterprise Support Services',
      location: 'Madrid',
      modality: 'Presencial',
      level: 'Junior / Técnico',
      description:
        'Perfil técnico para soporte de aplicaciones, resolución de incidencias, SQL, automatización de tareas, Active Directory y scripting.',
      keywords: ['Soporte', 'Incidencias', 'SQL', 'Automatización', 'Active Directory', 'Windows Server', 'Scripting']
    }
  ];

  cvData: CvData = this.createLuisCvData();

  strengths: string[] = [];
  weaknesses: string[] = [];
  recommendations: string[] = [];
  suggestedProfessionalProfile = '';
  recommendedKeywords: string[] = [];
  matches: JobMatch[] = [];
  cvReview: CvReviewItem[] = [];

  history: CvHistoryItem[] = [];
  showHistory = false;

  constructor(private http: HttpClient) { }

  selectOffer(offer: JobOffer): void {
    this.selectedOffer = offer;
    this.applicationSimulated = false;

    if (this.analysisDone) {
      this.analyzeCv();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.selectedFile = input.files[0];
    this.fileName = input.files[0].name;
    this.resetAnalysis();
  }

  analyzeCv(): void {
    if (!this.selectedFile || !this.selectedOffer) {
      return;
    }

    this.loading = true;
    this.analysisDone = false;
    this.applicationSimulated = false;

    setTimeout(() => {
      this.cvData = this.createLuisCvData();
      this.applyOfferAnalysis();

      this.loading = false;
      this.analysisDone = true;

      this.saveAnalysisToApi();
    }, 700);
  }

  simulateApplication(): void {
    if (!this.analysisDone) {
      return;
    }

    this.applicationSimulated = true;
  }

  simulateApplicationStatus(): string {
    if (!this.applicationSimulated || !this.selectedOffer) {
      return '';
    }

    return `Candidatura simulada correctamente para ${this.selectedOffer.title} en ${this.selectedOffer.company}.`;
  }

  private createLuisCvData(): CvData {
    return {
      name: 'Luis Andrés Martínez Berraquero',
      email: 'luisandresmartinezb@gmail.com',
      phone: '643 903 560',
      location: 'Madrid, España',
      linkedin: 'linkedin.com/in/luis-andres-martinez-berraquero',
      github: 'github.com/luisandresmartinezb',
      drivingLicense: 'Permiso de conducir: B',
      headline: 'Técnico Programador con Enfoque Full Stack',
      profile:
        'Técnico programador con 7 años de experiencia en el mercado IT, especializado en desarrollo de software, automatización de procesos, bases de datos, testing, soporte técnico y resolución de incidencias en entornos reales. He trabajado en administración pública, banca, retail, sector asegurador y proyectos empresariales, con tecnologías como C#, .NET, Java, Python, SQL, VBA, Angular y herramientas web. Perfil sólido, versátil y orientado a resultados.',
      experience: [
        {
          role: 'Técnico Programador',
          company: 'Dimática Software',
          period: '07/2021 - Presente',
          tasks: [
            'Proyecto MAPAMA: desarrollo de script en C# para lectura de PDF y generación automática de Excel.',
            'Proyecto Madrid SER: desarrollo en .NET MVC y aplicación de consola para validación de matrículas sin hardware.',
            'Proyecto ACS: desarrollo de macros VBA en Excel.',
            'Proyecto Smart Lockers: instalación y mantenimiento de terminales, soporte remoto e incidencias de software.',
            'Desarrollo de pantallas con Python 2.7 y automatización de procesos almacenados en PostgreSQL.',
            'Documentación técnica de proyectos desarrollados en Software Factory.'
          ]
        },
        {
          role: 'Técnico Programador',
          company: 'Ayuntamiento de Leganés',
          period: '12/2020 - 06/2021',
          tasks: [
            'Creación de módulos, formularios e interfaces para aplicación en MS Access con VBA.',
            'Operaciones CRUD sobre BBDD y desarrollo de ETLs.',
            'Resolución de incidencias en aplicación Java.',
            'Mantenimiento de equipos y soporte microinformático.'
          ]
        },
        {
          role: 'QA Tester',
          company: 'Alten - RSI Caja Rural',
          period: '03/2020 - 07/2020',
          tasks: [
            'Pruebas unitarias con JUnit y JPA en Eclipse, además de pruebas funcionales.',
            'Optimización y mejora de código en Java 8.',
            'Control de datos con SQL Developer y DBeaver.',
            'Resolución de incidencias mediante Remedy.',
            'Creación de cadenas Linux para ejecutar procesos y subida de cheques mediante SSH encriptado.'
          ]
        },
        {
          role: 'Técnico Programador',
          company: 'Seguros Purísima Concepción',
          period: '12/2019 - 02/2020',
          tasks: [
            'Desarrollo de aplicaciones en Velneo.',
            'Curso Velneo.',
            'Mantenimiento de equipos informáticos y resolución de incidencias microinformáticas.'
          ]
        },
        {
          role: 'Desarrollador Groovy',
          company: 'Grupo SIA - Proyecto Sanitas',
          period: '10/2018 - 04/2019',
          tasks: [
            'Manejo de OpenAM gráfico y por comandos.',
            'Programación Groovy, recopilaciones, scripts y gestión de datos.',
            'Uso de Linux, Eclipse, consola Groovy, DBeaver, SQL Developer.',
            'API de OpenAM con Groovy y desarrollo web con PL/SQL.'
          ]
        },
        {
          role: 'Programador Web y Entornos Previos Distribuidos',
          company: 'Visual Nacar',
          period: '06/2018 - 09/2018',
          tasks: [
            'Desarrollo de páginas web con HTML, CSS y JavaScript usando Visual Nacar.',
            'Operaciones con vi, uso de Remedy, SCP, XCom y envíos a distintos entornos.'
          ]
        },
        {
          role: 'Programador VBA y Base de Datos',
          company: 'Orange',
          period: '04/2018 - 06/2018',
          tasks: [
            'Curso Java con JUnit y JPA.',
            'Manejo de procesos almacenados, creación de tablas y sentencias en PL/SQL y SQL Developer.',
            'Creación de macros, botones y desarrollo en VBA Excel.'
          ]
        },
        {
          role: 'Técnico de Sistemas Operativos en Red',
          company: 'Ibermática',
          period: '11/2016 - 10/2017',
          tasks: [
            'Uso de Remedy para resolución de incidencias y plataforma de portátiles y CPUs.',
            'Configuración de Microsoft Exchange en dispositivos Android.',
            'Resolución de incidencias in situ y en remoto mediante ISL, AnyDesk y TeamViewer.',
            'Creación de imágenes con Acronis y gestión de usuarios con Active Directory en Windows Server 2012.'
          ]
        },
        {
          role: 'Técnico de Sistemas Prácticas',
          company: 'Colegio Retamar',
          period: '04/2016 - 07/2016',
          tasks: [
            'Soporte técnico, configuración de Outlook y resolución de incidencias in situ.',
            'Creación de imágenes con Acronis e instalación de servidores virtuales con VMware Workstation.',
            'Gestión de máquinas virtuales con VMware Server y soporte sobre Windows 7 y Windows 10.'
          ]
        }
      ],
      education: [
        '09/2025 - Actualidad · Máster en Arquitectura Cloud - Colegio Tajamar',
        '09/2024 - Actualidad · CFGS Desarrollo de Aplicaciones Web - FP PRO',
        '09/2019 - 06/2020 · Máster Privado en Java - Grupo Atrium',
        '09/2016 - 06/2018 · CFGS DAM - Colegio Retamar',
        '09/2014 - 06/2016 · CFGS ASIR - Colegio Retamar'
      ],
      aptitudes: [
        'Creatividad',
        'Trabajo en equipo',
        'Habilidades comunicativas',
        'Habilidades sociales',
        'Productividad',
        'Proactividad',
        'Resolución de problemas'
      ],
      languages: ['Castellano: Nativo', 'Inglés: A2'],
      certifications: [
        'Curso E-learning para tutores Online - 2020',
        'Certificado CyberArk Trustee - 2019',
        'Curso Java - Politécnico Colombia',
        'Curso PHP - Politécnico Colombia',
        'Curso Udemy de C++ - 2019',
        'Curso Udemy de GitHub - 2019',
        'Curso de .NET Core en Udemy - 2021',
        'Curso de Bases de Datos y Procedimientos Almacenados - Udemy'
      ],
      skills: {
        office: ['Word', 'Excel', 'Outlook', 'PowerPoint', 'Access'],
        programming: ['Java', 'Python', 'C#', 'JavaScript', 'VBA', 'C++', 'Groovy'],
        databases: ['PostgreSQL', 'Oracle', 'MySQL', 'SQL Server', 'Microsoft Access', 'PL/SQL'],
        web: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap 4/5', 'Angular', 'React', 'Vue'],
        testing: ['JUnit', 'Postman', 'Insomnia', 'JMeter'],
        systems: ['Linux', 'Windows Server', 'VMware', 'Active Directory', 'Git', 'GitHub', 'Figma'],
        management: ['Trello', 'Microsoft Project', 'Microsoft Teams']
      }
    };
  }

  private applyOfferAnalysis(): void {
    if (!this.selectedOffer) {
      return;
    }

    const cvText = this.normalizeText([
      this.cvData.profile,
      ...this.cvData.experience.flatMap(experience => [
        experience.role,
        experience.company,
        ...experience.tasks
      ]),
      ...this.getAllSkills()
    ].join(' '));

    const offerKeywords = this.selectedOffer.keywords.map(keyword => this.normalizeText(keyword));
    const matchedKeywords = offerKeywords.filter(keyword => cvText.includes(keyword));
    const missingKeywords = offerKeywords.filter(keyword => !cvText.includes(keyword));

    this.profileType = this.getProfileTypeByOffer(this.selectedOffer);
    this.suggestedProfessionalProfile = this.getProfileByOffer(this.selectedOffer);
    this.recommendedKeywords = this.getKeywordsByOffer(this.selectedOffer);
    this.score = this.calculateOfferScore(matchedKeywords.length, offerKeywords.length);

    this.summary =
      `SmartCareer AI ha comparado el CV con la oferta "${this.selectedOffer.title}". Se han detectado ${matchedKeywords.length} coincidencias de ${offerKeywords.length} palabras clave principales.`;

    this.strengths = [
      'Experiencia completa en desarrollo, soporte, testing, bases de datos y automatización.',
      'CV real con recorrido profesional amplio y varias tecnologías relevantes.',
      'Formación técnica alineada con desarrollo web, DAM, ASIR, Java y arquitectura cloud.',
      'Presencia de LinkedIn, GitHub y datos de contacto claros.',
      `Buen encaje con la oferta seleccionada: ${this.selectedOffer.title}.`
    ];

    this.weaknesses = [
      'El CV original es muy compacto y requiere priorizar información según la oferta.',
      'Faltan métricas cuantificadas de impacto profesional.',
      missingKeywords.length > 0
        ? `Keywords a reforzar para esta oferta: ${missingKeywords.join(', ')}.`
        : 'La oferta seleccionada tiene buena cobertura de keywords.'
    ];

    this.recommendations = [
      'Mantener el diseño original en una página.',
      'Adaptar solo titular, perfil profesional y orden de conocimientos.',
      'No eliminar experiencia: compactarla y priorizar lo más relevante.',
      'Añadir carta de presentación específica para la oferta.',
      'Simular candidatura para completar el flujo de producto.'
    ];

    this.matches = this.jobOffers.map(offer => ({
      role: offer.title,
      value: this.calculateMatchForOffer(offer)
    }));

    this.cvReview = [
      {
        title: 'Diseño conservado',
        description: 'El CV adaptado mantiene una estructura similar al CV original.',
        type: 'positive'
      },
      {
        title: 'Adaptación por oferta',
        description: 'El perfil, titular y keywords cambian según la oferta seleccionada.',
        type: 'positive'
      },
      {
        title: 'Mejora pendiente',
        description: 'Añadir métricas reales aumentaría la fuerza del CV.',
        type: 'warning'
      }
    ];

    this.coverLetterText = this.generateCoverLetter();
  }

  private calculateOfferScore(matched: number, total: number): number {
    const ratio = total === 0 ? 0 : matched / total;
    const base = 60;
    const keywordPoints = Math.round(ratio * 28);
    const experiencePoints = 7;
    const linksPoints = 3;

    return Math.min(base + keywordPoints + experiencePoints + linksPoints, 96);
  }

  private calculateMatchForOffer(offer: JobOffer): number {
    const cvText = this.normalizeText([
      ...this.getAllSkills(),
      ...this.cvData.experience.flatMap(exp => exp.tasks)
    ].join(' '));

    const matched = offer.keywords.filter(keyword =>
      cvText.includes(this.normalizeText(keyword))
    ).length;

    return Math.min(55 + Math.round((matched / offer.keywords.length) * 40), 96);
  }

  private getProfileTypeByOffer(offer: JobOffer): string {
    const title = offer.title.toLowerCase();

    if (title.includes('backend')) {
      return 'Perfil tecnológico / Backend .NET Developer';
    }

    if (title.includes('angular') || title.includes('full stack')) {
      return 'Perfil tecnológico / Full Stack Angular Developer';
    }

    if (title.includes('qa') || title.includes('tester')) {
      return 'Perfil tecnológico / QA Tester Técnico';
    }

    return 'Perfil tecnológico / Soporte Técnico con Desarrollo';
  }

  private getProfileByOffer(offer: JobOffer): string {
    const baseProfile =
      'Técnico programador con 7 años de experiencia en el mercado IT, especializado en desarrollo de software, automatización de procesos, bases de datos, testing, soporte técnico y resolución de incidencias en entornos reales. He trabajado en administración pública, banca, retail, sector asegurador y proyectos empresariales, con tecnologías como C#, .NET, Java, Python, SQL, VBA, Angular y herramientas web. Perfil sólido, versátil y orientado a resultados.';

    const title = offer.title.toLowerCase();

    if (title.includes('backend')) {
      return `${baseProfile} Especialización orientada al desarrollo Backend .NET utilizando C#, ASP.NET Core, .NET MVC, SQL Server, PostgreSQL, API REST, Git y herramientas de integración.`;
    }

    if (title.includes('angular') || title.includes('full stack')) {
      return `${baseProfile} Especialización orientada al desarrollo Full Stack con Angular, TypeScript, JavaScript, HTML5, CSS3, Bootstrap, C#, API REST y bases de datos SQL.`;
    }

    if (title.includes('qa') || title.includes('tester')) {
      return `${baseProfile} Especialización orientada al área de QA y Testing con experiencia en Java, JUnit, JPA, SQL Developer, DBeaver, JMeter, validación de datos y pruebas funcionales.`;
    }

    return `${baseProfile} Especialización orientada a soporte técnico, automatización, resolución de incidencias, Active Directory, Windows Server y mejora continua de procesos empresariales.`;
  }

  private getKeywordsByOffer(offer: JobOffer): string[] {
    const title = offer.title.toLowerCase();

    if (title.includes('backend')) {
      return ['C#', 'ASP.NET Core', '.NET MVC', 'SQL Server', 'PostgreSQL', 'PL/SQL', 'API REST', 'Git', 'Postman', 'Backend'];
    }

    if (title.includes('angular') || title.includes('full stack')) {
      return ['Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap', 'C#', 'API REST', 'SQL Server', 'Git'];
    }

    if (title.includes('qa') || title.includes('tester')) {
      return ['QA Tester', 'Testing', 'JUnit', 'JPA', 'Java', 'SQL Developer', 'DBeaver', 'JMeter', 'Validación', 'Pruebas funcionales'];
    }

    return ['Soporte técnico', 'Incidencias', 'SQL', 'Automatización', 'Active Directory', 'Windows Server', 'Scripting'];
  }

  private generateCoverLetter(): string {
    if (!this.selectedOffer) {
      return '';
    }

    return `Estimado equipo de ${this.selectedOffer.company}:

Me gustaría presentar mi candidatura para la posición de ${this.selectedOffer.title}. Soy técnico programador con experiencia en desarrollo de software, automatización de procesos, bases de datos, testing y soporte técnico en entornos empresariales.

A lo largo de mi trayectoria he trabajado con tecnologías como C#, .NET, Java, Angular, TypeScript, SQL, VBA, Git y herramientas de validación como DBeaver, SQL Developer, JUnit y JMeter. Esta combinación me permite aportar capacidad técnica, resolución de incidencias y adaptación a proyectos reales.

Me interesa especialmente esta oferta porque encaja con mi objetivo de seguir creciendo como programador y aportar valor desde el primer día.

Quedo a vuestra disposición para ampliar cualquier información sobre mi experiencia.

Atentamente,
Luis Andrés Martínez Berraquero`;
  }

  async downloadCorrectedCv(): Promise<void> {
    if (!this.analysisDone) {
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    await this.drawOnePageCv(doc);
    doc.save('CV_Adaptado_SmartCareerAI.pdf');
  }

  downloadCoverLetter(): void {
    if (!this.analysisDone || !this.coverLetterText) {
      return;
    }

    const doc = new jsPDF();
    const lines = doc.splitTextToSize(this.coverLetterText, 170);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Carta de presentación', 20, 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(lines, 20, 38);

    doc.save('Carta_Presentacion_SmartCareerAI.pdf');
  }

  private async drawOnePageCv(doc: jsPDF): Promise<void> {
    const primary = '#173b5c';
    const light = '#eef4f8';
    const text = '#172033';
    const muted = '#6b7280';

    doc.setFillColor(light);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setFillColor(primary);
    doc.rect(12, 8, 186, 2.2, 'F');

    doc.setTextColor(primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Luis Andrés Martínez', 17, 20);
    doc.text('Berraquero', 17, 29);

    doc.setFontSize(7.4);
    doc.setTextColor(muted);
    doc.text(this.getHeadlineText().toUpperCase(), 17, 37);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.4);
    doc.setTextColor(text);

    doc.text(this.cvData.location, 151, 18);
    doc.text(this.cvData.phone, 151, 23);
    doc.text(this.cvData.email, 151, 28);
    doc.textWithLink(this.cvData.linkedin, 151, 33, {
      url: `https://${this.cvData.linkedin}`
    });
    doc.textWithLink(this.cvData.github, 151, 38, {
      url: `https://${this.cvData.github}`
    });
    doc.text(this.cvData.drivingLicense, 151, 43);

    doc.setDrawColor(190, 205, 218);
    doc.line(12, 47, 198, 47);

    await this.drawProfilePhoto(doc, 17, 53, 25, 30);

    this.sectionTitle(doc, 'PERFIL PROFESIONAL', 48, 56, 146);
    this.paragraph(doc, this.suggestedProfessionalProfile, 48, 63, 145, 6.4, 3.2);

    this.sectionTitle(doc, 'EXPERIENCIA PROFESIONAL', 17, 91, 113);

    let y = 98;
    this.cvData.experience.forEach((exp) => {
      y = this.experienceBlock(doc, exp, 17, y, 113);
    });

    this.sectionTitle(doc, 'FORMACIÓN', 132, 91, 62);
    let yRight = 98;
    yRight = this.compactList(doc, this.cvData.education, 132, yRight, 62, 5.9, 3.1);

    yRight += 3;
    this.sectionTitle(doc, 'APTITUDES', 132, yRight, 62);
    yRight += 7;
    yRight = this.compactTextBlock(doc, this.cvData.aptitudes.join(' · '), 132, yRight, 62, 5.8, 3.1);

    yRight += 3;
    this.sectionTitle(doc, 'IDIOMAS', 132, yRight, 62);
    yRight += 7;
    yRight = this.compactList(doc, this.cvData.languages, 132, yRight, 62, 5.9, 3.1);

    yRight += 3;
    this.sectionTitle(doc, 'CERTIFICADOS', 132, yRight, 62);
    yRight += 7;
    yRight = this.compactList(doc, this.cvData.certifications, 132, yRight, 62, 5.5, 2.9);

    yRight += 3;
    this.sectionTitle(doc, 'CONOCIMIENTOS', 132, yRight, 62);
    yRight += 7;

    yRight = this.skillGroup(doc, 'SUITE OFFICE', this.cvData.skills.office, 132, yRight, 62);
    yRight = this.skillGroup(doc, 'LENGUAJES DE PROGRAMACIÓN', this.reorderSkills(this.cvData.skills.programming), 132, yRight, 62);
    yRight = this.skillGroup(doc, 'BASES DE DATOS', this.reorderSkills(this.cvData.skills.databases), 132, yRight, 62);
    yRight = this.skillGroup(doc, 'WEB', this.reorderSkills(this.cvData.skills.web), 132, yRight, 62);
    yRight = this.skillGroup(doc, 'TESTING / QA', this.reorderSkills(this.cvData.skills.testing), 132, yRight, 62);
    yRight = this.skillGroup(doc, 'SISTEMAS / DEVOPS', this.reorderSkills(this.cvData.skills.systems), 132, yRight, 62);
    this.skillGroup(doc, 'HERRAMIENTAS DE GESTIÓN', this.cvData.skills.management, 132, yRight, 62);
  }

  private experienceBlock(doc: jsPDF, exp: CvExperience, x: number, y: number, width: number): number {
    if (y > 273) {
      return y;
    }

    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#172033');
    doc.setFontSize(6.3);
    doc.text(exp.role, x, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.6);
    doc.text(exp.period, x + width - 28, y);

    y += 3.2;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor('#172033');
    doc.text(exp.company, x, y);

    y += 3.2;

    const tasks = this.prioritizeTasksForOffer(exp.tasks).slice(0, 3);

    tasks.forEach(task => {
      const lines = doc.splitTextToSize(`• ${task}`, width);
      doc.text(lines, x, y);
      y += lines.length * 2.7 + 1;
    });

    y += 1.5;

    return y;
  }

  private prioritizeTasksForOffer(tasks: string[]): string[] {
    if (!this.selectedOffer) {
      return tasks;
    }

    const keywords = this.selectedOffer.keywords.map(keyword => this.normalizeText(keyword));

    return [...tasks].sort((a, b) => {
      const aScore = keywords.filter(keyword => this.normalizeText(a).includes(keyword)).length;
      const bScore = keywords.filter(keyword => this.normalizeText(b).includes(keyword)).length;

      return bScore - aScore;
    });
  }

  private reorderSkills(skills: string[]): string[] {
    if (!this.selectedOffer) {
      return skills;
    }

    const offerKeywords = this.selectedOffer.keywords.map(keyword => this.normalizeText(keyword));

    return [...skills].sort((a, b) => {
      const aScore = offerKeywords.includes(this.normalizeText(a)) ? 1 : 0;
      const bScore = offerKeywords.includes(this.normalizeText(b)) ? 1 : 0;

      return bScore - aScore;
    });
  }

  private getHeadlineText(): string {
    if (!this.selectedOffer) {
      return this.cvData.headline;
    }

    const title = this.selectedOffer.title.toLowerCase();

    if (title.includes('backend')) {
      return 'Técnico Programador · Backend .NET Junior';
    }

    if (title.includes('angular') || title.includes('full stack')) {
      return 'Técnico Programador · Full Stack Angular Junior';
    }

    if (title.includes('qa') || title.includes('tester')) {
      return 'Técnico Programador · QA Tester Técnico';
    }

    return 'Técnico Programador · Soporte Técnico con Desarrollo';
  }

  private async drawProfilePhoto(doc: jsPDF, x: number, y: number, width: number, height: number): Promise<void> {
    try {
      const imageBase64 = await this.loadImageAsBase64('luis_2026.png');
      doc.addImage(imageBase64, 'PNG', x, y, width, height);
    } catch {
      doc.setFillColor(230, 238, 245);
      doc.rect(x, y, width, height, 'F');
      doc.setTextColor('#173b5c');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text('FOTO', x + 8, y + 16);
    }
  }

  private async loadImageAsBase64(path: string): Promise<string> {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`No se pudo cargar la imagen: ${path}`);
    }

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject('Error convirtiendo la imagen a Base64');

      reader.readAsDataURL(blob);
    });
  }

  private sectionTitle(doc: jsPDF, title: string, x: number, y: number, width: number): void {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor('#173b5c');
    doc.text(title, x, y);
    doc.setDrawColor(190, 205, 218);
    doc.line(x, y + 2, x + width, y + 2);
  }

  private paragraph(doc: jsPDF, text: string, x: number, y: number, width: number, size: number, lineHeight: number): number {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor('#172033');

    const lines = doc.splitTextToSize(text, width);
    doc.text(lines, x, y);

    return y + lines.length * lineHeight;
  }

  private compactList(doc: jsPDF, items: string[], x: number, y: number, width: number, size: number, lineHeight: number): number {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor('#172033');

    items.forEach(item => {
      const lines = doc.splitTextToSize(`• ${item}`, width);
      doc.text(lines, x, y);
      y += lines.length * lineHeight + 1;
    });

    return y;
  }

  private compactTextBlock(doc: jsPDF, text: string, x: number, y: number, width: number, size: number, lineHeight: number): number {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor('#172033');

    const lines = doc.splitTextToSize(text, width);
    doc.text(lines, x, y);

    return y + lines.length * lineHeight;
  }

  private skillGroup(doc: jsPDF, title: string, skills: string[], x: number, y: number, width: number): number {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.6);
    doc.setTextColor('#173b5c');
    doc.text(title, x, y);

    y += 3;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.3);
    doc.setTextColor('#172033');

    const lines = doc.splitTextToSize(skills.join(' · '), width);
    doc.text(lines, x, y);

    return y + lines.length * 2.6 + 2.3;
  }

  generateProfessionalReport(): void {
    if (!this.analysisDone) {
      return;
    }

    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(20);
    doc.text('Informe ATS - SmartCareer AI', 20, y);

    y += 12;
    doc.setFontSize(11);
    doc.text(`Archivo analizado: ${this.fileName}`, 20, y);

    y += 8;
    doc.text(`Oferta seleccionada: ${this.selectedOffer?.title || 'Sin oferta'}`, 20, y);

    y += 8;
    doc.text(`Puntuación ATS: ${this.score}/100`, 20, y);

    y += 8;
    doc.text(`Perfil detectado: ${this.profileType}`, 20, y);

    y += 14;
    doc.setFontSize(14);
    doc.text('Resumen del análisis', 20, y);

    y += 8;
    doc.setFontSize(11);
    const summaryLines = doc.splitTextToSize(this.summary, 170);
    doc.text(summaryLines, 20, y);
    y += summaryLines.length * 6 + 8;

    y = this.addPdfSection(doc, 'Fortalezas', this.strengths, y);
    y = this.addPdfSection(doc, 'Puntos débiles', this.weaknesses, y);
    y = this.addPdfSection(doc, 'Recomendaciones', this.recommendations, y);
    y = this.addPdfSection(doc, 'Palabras clave recomendadas', this.recommendedKeywords, y);

    doc.save('Informe_ATS_SmartCareerAI.pdf');
  }

  loadHistoryFromApi(): void {
    this.http.get<CvHistoryItem[]>(`${this.apiUrl}/history`).subscribe({
      next: (response) => {
        this.history = response;
        this.showHistory = true;
      },
      error: (error) => {
        console.error('Error cargando historial:', error);
      }
    });
  }

  private saveAnalysisToApi(): void {
    const request = {
      fullName: this.candidateName,
      email: this.cvData.email || 'demo@smartcareer.ai',
      fileName: this.fileName,
      atsScore: this.score,
      profileDetected: this.profileType,
      strengths: this.strengths,
      weaknesses: this.weaknesses,
      recommendations: this.recommendations
    };

    this.http.post(this.apiUrl, request).subscribe({
      next: () => { },
      error: (error) => {
        console.error('Error guardando análisis:', error);
      }
    });
  }

  private addPdfSection(doc: jsPDF, title: string, items: string[], y: number): number {
    if (y > 245) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.text(title, 20, y);
    y += 8;

    doc.setFontSize(11);

    items.forEach((item) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      const lines = doc.splitTextToSize(`- ${item}`, 170);
      doc.text(lines, 20, y);
      y += lines.length * 6 + 3;
    });

    return y + 6;
  }

  private getAllSkills(): string[] {
    return [
      ...this.cvData.skills.office,
      ...this.cvData.skills.programming,
      ...this.cvData.skills.databases,
      ...this.cvData.skills.web,
      ...this.cvData.skills.testing,
      ...this.cvData.skills.systems,
      ...this.cvData.skills.management
    ];
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private resetAnalysis(): void {
    this.loading = false;
    this.analysisDone = false;
    this.applicationSimulated = false;
    this.candidateName = 'Candidato';
    this.score = 0;
    this.profileType = '';
    this.summary = '';
    this.coverLetterText = '';
    this.cvData = this.createLuisCvData();
    this.strengths = [];
    this.weaknesses = [];
    this.recommendations = [];
    this.suggestedProfessionalProfile = '';
    this.recommendedKeywords = [];
    this.matches = [];
    this.cvReview = [];
    this.showHistory = false;
  }
}
