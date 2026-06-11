import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';

type JobMatch = {
  role: string;
  value: number;
};

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  fileName = '';
  analysisDone = false;
  loading = false;

  score = 0;
  profileType = '';
  summary = '';

  strengths: string[] = [];
  improvements: string[] = [];
  matches: JobMatch[] = [];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
      this.analysisDone = false;
      this.loading = false;
      this.score = 0;
      this.profileType = '';
      this.summary = '';
      this.strengths = [];
      this.improvements = [];
      this.matches = [];
    }
  }

  analyzeCv(): void {
    this.loading = true;
    this.analysisDone = false;

    const file = this.fileName.toLowerCase();

    if (file.includes('luis') || file.includes('programador') || file.includes('developer')) {
      this.score = this.getRandomScore(78, 92);
      this.profileType = 'Perfil tecnológico / Full Stack Developer';

      this.summary =
        'CV técnico con experiencia real en desarrollo de software, soporte, bases de datos y tecnologías Full Stack. Tiene buena base profesional, pero debe reforzar certificaciones cloud y destacar más los proyectos.';

      this.strengths = [
        'Experiencia profesional en desarrollo de software.',
        'Conocimientos en C#, SQL Server, Angular, Java y Python.',
        'Experiencia en entornos reales de empresa.',
        'Formación relacionada con DAW y Arquitecturas Cloud.'
      ];

      this.improvements = [
        'Añadir proyectos personales desplegados en Azure o AWS.',
        'Destacar resultados medibles en cada proyecto.',
        'Reforzar certificaciones oficiales cloud.',
        'Mejorar el resumen profesional para orientar el CV a perfil Full Stack.'
      ];

      this.matches = [
        { role: 'Backend .NET Developer', value: 92 },
        { role: 'Full Stack Angular Developer', value: 88 },
        { role: 'Cloud Developer', value: 76 }
      ];
    } else if (file.includes('administrativo') || file.includes('admin')) {
      this.score = this.getRandomScore(70, 82);
      this.profileType = 'Perfil administrativo';

      this.summary =
        'CV orientado a administración y gestión documental. El perfil es correcto, pero necesita destacar herramientas ofimáticas, atención al cliente y experiencia con procesos internos.';

      this.strengths = [
        'Experiencia en gestión documental.',
        'Capacidad organizativa.',
        'Conocimientos de Microsoft Office.',
        'Perfil adecuado para tareas administrativas.'
      ];

      this.improvements = [
        'Añadir herramientas concretas utilizadas: Excel, Word, Outlook y Teams.',
        'Destacar tareas de atención telefónica o gestión de incidencias.',
        'Incluir logros medibles como volumen de documentos gestionados.',
        'Mejorar el resumen profesional inicial.'
      ];

      this.matches = [
        { role: 'Administrativo', value: 84 },
        { role: 'Auxiliar Administrativo', value: 81 },
        { role: 'Back Office', value: 76 }
      ];
    } else if (file.includes('marketing')) {
      this.score = this.getRandomScore(72, 85);
      this.profileType = 'Perfil marketing digital';

      this.summary =
        'CV con orientación a comunicación, campañas y presencia digital. Puede mejorar si añade métricas de impacto y herramientas específicas de marketing.';

      this.strengths = [
        'Perfil creativo y orientado a comunicación.',
        'Conocimientos en redes sociales.',
        'Capacidad para trabajar campañas digitales.',
        'Interés por análisis de resultados.'
      ];

      this.improvements = [
        'Añadir métricas de campañas realizadas.',
        'Indicar herramientas como Google Analytics, Meta Ads o Canva.',
        'Mostrar ejemplos de campañas o portfolio.',
        'Mejorar palabras clave relacionadas con SEO y SEM.'
      ];

      this.matches = [
        { role: 'Marketing Assistant', value: 82 },
        { role: 'Social Media Manager', value: 78 },
        { role: 'Content Creator', value: 75 }
      ];
    } else {
      this.score = this.getRandomScore(60, 76);
      this.profileType = 'Perfil profesional general';

      this.summary =
        'CV válido como base inicial, pero necesita mayor concreción en experiencia, herramientas utilizadas y logros profesionales.';

      this.strengths = [
        'Estructura básica comprensible.',
        'Experiencia profesional presentada de forma ordenada.',
        'Perfil adaptable a distintos sectores.'
      ];

      this.improvements = [
        'Añadir palabras clave del sector objetivo.',
        'Destacar herramientas y funciones concretas.',
        'Incluir logros medibles.',
        'Adaptar el CV a cada oferta laboral.'
      ];

      this.matches = [
        { role: 'Perfil generalista', value: 70 },
        { role: 'Atención al cliente', value: 68 },
        { role: 'Administración básica', value: 64 }
      ];
    }

    this.loading = false;
    this.analysisDone = true;
  }

  downloadImprovedCv(): void {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Informe de mejora del CV - SmartCareer AI', 20, 20);

    doc.setFontSize(12);
    doc.text('Perfil profesional optimizado:', 20, 40);
    doc.text(this.summary, 20, 50, { maxWidth: 170 });

    doc.text('Fortalezas detectadas:', 20, 85);
    this.strengths.forEach((item, index) => {
      doc.text(`- ${item}`, 20, 95 + index * 10, { maxWidth: 170 });
    });

    const startY = 145;
    doc.text('Mejoras recomendadas:', 20, startY);
    this.improvements.forEach((item, index) => {
      doc.text(`- ${item}`, 20, startY + 10 + index * 10, { maxWidth: 170 });
    });

    doc.text('Compatibilidad con ofertas:', 20, 205);
    this.matches.forEach((match, index) => {
      doc.text(`${match.role}: ${match.value}%`, 20, 215 + index * 10);
    });

    doc.save('Informe_Mejora_CV_SmartCareerAI.pdf');
  }

  private getRandomScore(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

