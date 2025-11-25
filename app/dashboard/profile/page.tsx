import { ProfileHeader } from '../../../components/profile/ProfileHeader';
import { InfoSection } from '../../../components/profile/InfoSection';
import { EducationSection } from '../../../components/profile/EducationSection';
import { SkillsSection } from '../../../components/profile/SkillsSection';
import { ResumeSection } from '../../../components/profile/ResumeSection';
import { ExperienceSection } from '../../../components/profile/ExperienceSection';

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 space-y-8">
        <ProfileHeader />
        <div className="space-y-10">
          <InfoSection />
          <ExperienceSection />
         <SkillsSection />
          <EducationSection />
          <ResumeSection />
        </div>
      </div>
    </div>
  );
}
