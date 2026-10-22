import { useEffect } from 'react';

import { AppointmentSection } from '@/components/sections/AppointmentSection';
import { ClinicGallery } from '@/components/sections/ClinicGallery';
import { ContactSection } from '@/components/sections/ContactSection';
import { Hero } from '@/components/sections/Hero';
import { ProfessionalSection } from '@/components/sections/ProfessionalSection';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { TreatmentsSection } from '@/components/sections/TreatmentsSection';
import { TrustIndicators } from '@/components/sections/TrustIndicators';
import { CLINICA, PROFISSIONAIS } from '@/config/clinica';
import { aplicarMetadados } from '@/lib/seo';

const [DR_CARLOS, DRA_THAILHA] = PROFISSIONAIS;

export function HomePage() {
  useEffect(() => {
    aplicarMetadados({
      titulo: `${CLINICA.nomeCompleto} | Implantes dentários em ${CLINICA.cidade} - ${CLINICA.uf}`,
      descricao:
        `Clínica de implantes dentários em ${CLINICA.cidade}. Implantes, reabilitação oral, ` +
        'avaliação odontológica e harmonização facial. Agende sua avaliação pelo WhatsApp.',
      caminho: '/',
    });
  }, []);

  return (
    <>
      <Hero />
      <TrustIndicators />
      <TreatmentsSection />

      {/* Âncora única para os dois profissionais. */}
      <div id="profissionais">
        {DR_CARLOS ? (
          <ProfessionalSection
            profissional={DR_CARLOS}
            sobretitulo="Equipe Implavita"
            fundoEscuro
          />
        ) : null}

        {DRA_THAILHA ? (
          <ProfessionalSection
            profissional={DRA_THAILHA}
            sobretitulo="Harmonização facial"
            disposicao="inverso"
          />
        ) : null}
      </div>

      <ClinicGallery />
      <AppointmentSection />
      <ReviewsSection />
      <ContactSection />
    </>
  );
}
