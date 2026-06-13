import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
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

    this.loading = false;
    this.analysisDone = true;

    this.loadTechnologyProfile();
    this.score = 90;

    this.matches = [
      { role: 'Backend .NET Developer', value: 93 },
      { role: 'Full Stack Angular Developer', value: 90 },
      { role: 'Cloud Developer Junior', value: 80 }
    ];
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
  }
}
