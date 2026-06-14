import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly apiUrl = 'http://localhost:5017/api/CvAnalysis';

  fileName = '';
  selectedFile: File | null = null;

  analysisDone = false;
  loading = false;

  candidateName = 'Candidato';
  score = 0;
  profileType = '';
  summary = '';

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileName = input.files[0].name;
      this.resetAnalysis();
    }
  }

  analyzeCv(): void {
    if (!this.selectedFile) {
      return;
    }

    const file = this.fileName.toLowerCase();

    if (
      file.includes('malo') ||
      file.includes('horrible') ||
      file.includes('incompleto') ||
      file.includes('prueba') ||
      file.includes('test')
    ) {
      this.loadWeakProfile();
      this.score = this.calculateScoreByProfile('weak');
    } else if (
      file.includes('luis') ||
      file.includes('programador') ||
      file.includes('developer') ||
      file.includes('fullstack') ||
      file.includes('full-stack') ||
      file.includes('cv')
    ) {
      this.loadTechnologyProfile();
      this.score = this.calculateScoreByProfile('technology');
    } else if (
      file.includes('admin') ||
      file.includes('administrativo')
    ) {
      this.loadAdministrativeProfile();
      this.score = this.calculateScoreByProfile('administrative');
    } else if (file.includes('marketing')) {
      this.loadMarketingProfile();
      this.score = this.calculateScoreByProfile('marketing');
    } else {
      this.loadGeneralProfile();
      this.score = this.calculateScoreByProfile('general');
    }

    this.refreshMatchScores();
    this.loading = false;
    this.analysisDone = true;

    this.saveAnalysisToApi();
  }

  loadHistoryFromApi(): void {
    this.http.get<CvHistoryItem[]>(`${this.apiUrl}/history`)
      .subscribe({
        next: (response) => {
          this.history = response;
          this.showHistory = true;
          console.log('Historial cargado:', response);
        },
        error: (error) => {
          console.error('Error cargando historial:', error);
        }
      });
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

  downloadCorrectedCv(): void {
    if (!this.analysisDone) {
      return;
    }

    const doc = new jsPDF();
    let y = 18;

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 34, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(this.candidateName, 18, y);

    y += 8;
    doc.setFontSize(10);
    doc.text(this.profileType, 18, y);

    doc.setTextColor(15, 23, 42);
    y = 48;

    doc.setFontSize(14);
    doc.text('PERFIL PROFESIONAL', 18, y);

    y += 8;
    doc.setFontSize(11);
    const profileLines = doc.splitTextToSize(this.suggestedProfessionalProfile, 174);
    doc.text(profileLines, 18, y);
    y += profileLines.length * 6 + 10;

    doc.setFontSize(14);
    doc.text('COMPETENCIAS CLAVE', 18, y);

    y += 8;
    doc.setFontSize(10);
    const keywordsLines = doc.splitTextToSize(this.recommendedKeywords.join(' · '), 174);
    doc.text(keywordsLines, 18, y);
    y += keywordsLines.length * 6 + 10;

    doc.setFontSize(14);
    doc.text('EXPERIENCIA PROFESIONAL', 18, y);

    y += 8;
    doc.setFontSize(11);
    const experienceLines = doc.splitTextToSize(this.getCorrectedExperienceText(), 174);
    doc.text(experienceLines, 18, y);
    y += experienceLines.length * 6 + 10;

    doc.setFontSize(14);
    doc.text('PROYECTOS DESTACADOS', 18, y);

    y += 8;
    doc.setFontSize(11);

    this.getCorrectedProjects().forEach((project) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      const lines = doc.splitTextToSize(`• ${project}`, 168);
      doc.text(lines, 22, y);
      y += lines.length * 6 + 4;
    });

    if (y > 245) {
      doc.addPage();
      y = 20;
    }

    y += 4;
    doc.setFontSize(14);
    doc.text('FORMACIÓN Y TECNOLOGÍAS', 18, y);

    y += 8;
    doc.setFontSize(11);
    const trainingLines = doc.splitTextToSize(this.getCorrectedTrainingText(), 174);
    doc.text(trainingLines, 18, y);

    doc.save('CV_Corregido_SmartCareerAI.pdf');
  }

  private saveAnalysisToApi(): void {
    const request = {
      fullName: this.candidateName,
      email: 'demo@smartcareer.ai',
      fileName: this.fileName,
      atsScore: this.score,
      profileDetected: this.profileType,
      strengths: this.strengths,
      weaknesses: this.weaknesses,
      recommendations: this.recommendations
    };

    this.http.post(this.apiUrl, request)
      .subscribe({
        next: (response) => {
          console.log('Análisis guardado en backend:', response);
        },
        error: (error) => {
          console.error('Error guardando análisis:', error);
        }
      });
  }

  private calculateScoreByProfile(profile: string): number {
    switch (profile) {
      case 'technology':
        return this.getScoreFromFileName(82, 94);
      case 'administrative':
        return this.getScoreFromFileName(68, 82);
      case 'marketing':
        return this.getScoreFromFileName(65, 80);
      case 'weak':
        return this.getScoreFromFileName(18, 42);
      default:
        return this.getScoreFromFileName(48, 66);
    }
  }

  private getScoreFromFileName(min: number, max: number): number {
    let total = 0;

    for (let i = 0; i < this.fileName.length; i++) {
      total += this.fileName.charCodeAt(i);
    }

    return min + (total % (max - min + 1));
  }

  private refreshMatchScores(): void {
    const profile = this.profileType.toLowerCase();

    if (profile.includes('tecnológico')) {
      this.matches = [
        { role: 'Backend .NET Developer', value: Math.min(this.score + 3, 98) },
        { role: 'Full Stack Angular Developer', value: Math.min(this.score, 96) },
        { role: 'Cloud Developer Junior', value: Math.max(this.score - 10, 60) }
      ];
      return;
    }

    if (profile.includes('administrativo')) {
      this.matches = [
        { role: 'Administrativo', value: Math.min(this.score + 4, 96) },
        { role: 'Auxiliar Administrativo', value: Math.min(this.score, 94) },
        { role: 'Back Office', value: Math.max(this.score - 5, 55) }
      ];
      return;
    }

    if (profile.includes('marketing')) {
      this.matches = [
        { role: 'Marketing Assistant', value: Math.min(this.score + 3, 96) },
        { role: 'Social Media Manager', value: Math.min(this.score, 94) },
        { role: 'Content Creator', value: Math.max(this.score - 6, 55) }
      ];
      return;
    }

    if (profile.includes('incompleto')) {
      this.matches = [
        { role: 'Perfil general inicial', value: Math.min(this.score + 5, 45) },
        { role: 'Candidato junior sin optimizar', value: Math.min(this.score, 40) },
        { role: 'CV pendiente de mejora', value: Math.max(this.score - 5, 10) }
      ];
      return;
    }

    this.matches = [
      { role: 'Perfil generalista', value: Math.min(this.score + 2, 90) },
      { role: 'Atención al cliente', value: Math.max(this.score - 4, 40) },
      { role: 'Administración básica', value: Math.max(this.score - 6, 40) }
    ];
  }

  private loadTechnologyProfile(): void {
    this.candidateName = 'Luis Andrés Martínez Berraquero';
    this.profileType = 'Perfil tecnológico / Full Stack Developer';

    this.summary =
      'El CV presenta una base técnica orientada al desarrollo de software, con experiencia en backend, frontend, bases de datos y herramientas de programación. El perfil encaja con posiciones Full Stack Junior, Backend .NET o Cloud Developer Junior.';

    this.strengths = [
      'Experiencia profesional en desarrollo de software.',
      'Conocimientos en C#, SQL Server, Angular, Java y Python.',
      'Presencia de tecnologías relevantes para sistemas ATS.',
      'Perfil orientado a desarrollo Full Stack y backend.'
    ];

    this.weaknesses = [
      'Faltan métricas concretas de impacto profesional.',
      'Conviene separar mejor experiencia de desarrollo y tareas de soporte.',
      'Debe destacar proyectos técnicos con resultados medibles.',
      'Sería recomendable adaptar el CV a cada oferta.'
    ];

    this.recommendations = [
      'Añadir una sección clara de proyectos técnicos.',
      'Destacar tecnologías principales: C#, Angular, SQL Server, API REST y Git.',
      'Incluir logros medibles en cada experiencia.',
      'Reforzar el resumen profesional hacia Full Stack Developer.'
    ];

    this.suggestedProfessionalProfile =
      'Técnico programador con experiencia en desarrollo de software, bases de datos y soporte técnico en entornos empresariales. Orientado al desarrollo Full Stack con conocimientos en C#, ASP.NET Core, Angular, SQL Server, Java y Python. Interesado en la creación de aplicaciones web, APIs REST y soluciones escalables.';

    this.recommendedKeywords = [
      'C#',
      'ASP.NET Core',
      'Angular',
      'SQL Server',
      'Entity Framework Core',
      'REST API',
      'Git',
      'Full Stack Developer',
      'Backend Developer'
    ];

    this.cvReview = [
      {
        title: 'Buena orientación técnica',
        description: 'El CV incluye tecnologías útiles para sistemas ATS.',
        type: 'positive'
      },
      {
        title: 'Mejorar impacto profesional',
        description: 'Se recomienda añadir proyectos y resultados medibles.',
        type: 'warning'
      },
      {
        title: 'Perfil mezclado',
        description: 'Debe diferenciar mejor desarrollo de software y soporte técnico.',
        type: 'danger'
      }
    ];
  }

  private loadAdministrativeProfile(): void {
    this.candidateName = 'Candidato';
    this.profileType = 'Perfil administrativo';

    this.summary =
      'El CV presenta orientación a tareas administrativas y gestión documental.';

    this.strengths = [
      'Perfil orientado a organización y gestión.',
      'Presencia de competencias administrativas.',
      'Adecuado para back office o apoyo administrativo.'
    ];

    this.weaknesses = [
      'Faltan métricas sobre volumen de documentación o procesos gestionados.',
      'Sería recomendable incluir herramientas concretas.',
      'El resumen profesional puede estar más orientado a una oferta específica.'
    ];

    this.recommendations = [
      'Añadir herramientas como Excel, Word, Outlook y Teams.',
      'Destacar tareas de atención al cliente, documentación o gestión de incidencias.',
      'Incluir logros medibles.'
    ];

    this.suggestedProfessionalProfile =
      'Profesional administrativo con experiencia en gestión documental, organización de información, atención al cliente y apoyo a procesos internos. Perfil orientado a la eficiencia, la comunicación y la resolución de incidencias.';

    this.recommendedKeywords = [
      'Gestión documental',
      'Excel',
      'Word',
      'Outlook',
      'Atención al cliente',
      'Back Office',
      'Administración',
      'Organización'
    ];

    this.cvReview = [
      {
        title: 'Perfil claro',
        description: 'El CV encaja con funciones administrativas y de apoyo interno.',
        type: 'positive'
      },
      {
        title: 'Faltan herramientas',
        description: 'Conviene indicar herramientas concretas utilizadas en el puesto.',
        type: 'warning'
      }
    ];
  }

  private loadMarketingProfile(): void {
    this.candidateName = 'Candidato';
    this.profileType = 'Perfil marketing digital';

    this.summary =
      'El CV presenta orientación a comunicación, campañas, contenido digital o presencia online.';

    this.strengths = [
      'Perfil creativo y orientado a comunicación.',
      'Presencia de conceptos relacionados con marketing o contenido.',
      'Potencial para campañas digitales o redes sociales.'
    ];

    this.weaknesses = [
      'Faltan métricas de campañas.',
      'No se detectan suficientes herramientas especializadas.',
      'Sería recomendable añadir portfolio o ejemplos.'
    ];

    this.recommendations = [
      'Añadir métricas de campañas realizadas.',
      'Indicar herramientas como Google Analytics, Meta Ads, Canva o Mailchimp.',
      'Mostrar ejemplos de campañas o portfolio.'
    ];

    this.suggestedProfessionalProfile =
      'Profesional orientado al marketing digital, comunicación y creación de contenido, con interés en redes sociales, campañas digitales, análisis de resultados y posicionamiento de marca.';

    this.recommendedKeywords = [
      'Marketing digital',
      'SEO',
      'SEM',
      'Google Analytics',
      'Meta Ads',
      'Canva',
      'Redes sociales',
      'Content Marketing'
    ];

    this.cvReview = [
      {
        title: 'Perfil creativo',
        description: 'El CV transmite orientación a comunicación y contenido digital.',
        type: 'positive'
      },
      {
        title: 'Faltan métricas',
        description: 'Las campañas deberían ir acompañadas de resultados medibles.',
        type: 'warning'
      }
    ];
  }

  private loadGeneralProfile(): void {
    this.candidateName = 'Candidato';
    this.profileType = 'Perfil profesional general';

    this.summary =
      'El CV tiene una base inicial, pero necesita mayor concreción en experiencia, herramientas utilizadas, logros profesionales y orientación hacia un puesto objetivo.';

    this.strengths = [
      'Estructura básica comprensible.',
      'Perfil adaptable a distintos sectores.',
      'Permite trabajar una mejora progresiva.'
    ];

    this.weaknesses = [
      'Faltan palabras clave del sector objetivo.',
      'No se identifican suficientes herramientas concretas.',
      'El perfil puede parecer demasiado genérico.'
    ];

    this.recommendations = [
      'Añadir palabras clave del sector objetivo.',
      'Destacar herramientas y funciones concretas.',
      'Incluir logros medibles.',
      'Adaptar el CV a cada oferta laboral.'
    ];

    this.suggestedProfessionalProfile =
      'Profesional con experiencia adaptable a distintos entornos, capacidad de aprendizaje y orientación a la mejora continua. Perfil polivalente con interés en aportar valor mediante organización, responsabilidad y compromiso.';

    this.recommendedKeywords = [
      'Trabajo en equipo',
      'Comunicación',
      'Organización',
      'Resolución de problemas',
      'Adaptabilidad'
    ];

    this.cvReview = [
      {
        title: 'Base inicial válida',
        description: 'El CV tiene una estructura comprensible para comenzar a trabajar.',
        type: 'positive'
      },
      {
        title: 'Demasiado genérico',
        description: 'Se recomienda orientar el documento a un puesto concreto.',
        type: 'warning'
      }
    ];
  }

  private loadWeakProfile(): void {
    this.candidateName = 'Candidato';
    this.profileType = 'CV incompleto / Perfil poco optimizado';

    this.summary =
      'El CV presenta una estructura débil para sistemas ATS. Faltan palabras clave, experiencia detallada, tecnologías, logros medibles y una orientación clara hacia un puesto concreto.';

    this.strengths = [
      'El documento puede servir como base inicial.',
      'Permite identificar áreas claras de mejora.'
    ];

    this.weaknesses = [
      'Faltan palabras clave relevantes para sistemas ATS.',
      'No se identifican logros profesionales medibles.',
      'La experiencia no está suficientemente desarrollada.',
      'El perfil profesional no está orientado a un puesto concreto.'
    ];

    this.recommendations = [
      'Añadir un resumen profesional claro.',
      'Incluir experiencia detallada con funciones y resultados.',
      'Añadir tecnologías, herramientas o competencias concretas.',
      'Adaptar el CV a una oferta laboral específica.',
      'Incluir enlaces profesionales como LinkedIn o GitHub si aplica.'
    ];

    this.suggestedProfessionalProfile =
      'Profesional en proceso de mejora de su perfil laboral, con necesidad de reforzar la estructura del currículum, añadir competencias clave, experiencia detallada y objetivos profesionales claros.';

    this.recommendedKeywords = [
      'Experiencia',
      'Formación',
      'Competencias',
      'Herramientas',
      'Logros',
      'LinkedIn'
    ];

    this.cvReview = [
      {
        title: 'CV poco optimizado',
        description: 'El documento necesita más estructura, detalle y palabras clave para mejorar su lectura por ATS.',
        type: 'danger'
      },
      {
        title: 'Faltan logros medibles',
        description: 'Conviene añadir resultados concretos, proyectos y responsabilidades claras.',
        type: 'warning'
      }
    ];
  }

  private getCorrectedExperienceText(): string {
    return 'Experiencia en desarrollo de software, bases de datos, aplicaciones web, soporte técnico y participación en entornos empresariales. Perfil orientado a soluciones Full Stack, APIs REST, SQL Server, Angular y buenas prácticas de desarrollo.';
  }

  private getCorrectedProjects(): string[] {
    return [
      'Desarrollo de aplicaciones web con tecnologías backend, frontend y bases de datos relacionales.',
      'Creación de soluciones orientadas a API REST, arquitectura limpia y buenas prácticas de desarrollo.',
      'Uso de herramientas de control de versiones, documentación técnica y mantenimiento de aplicaciones.'
    ];
  }

  private getCorrectedTrainingText(): string {
    return 'Formación y competencias relacionadas con desarrollo de software, backend, frontend, bases de datos, APIs, control de versiones y arquitecturas modernas de aplicaciones.';
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

  private resetAnalysis(): void {
    this.analysisDone = false;
    this.loading = false;
    this.candidateName = 'Candidato';
    this.score = 0;
    this.profileType = '';
    this.summary = '';
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
