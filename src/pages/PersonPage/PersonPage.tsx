import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Briefcase,
  Instagram,
  Twitter,
  ExternalLink,
  Film,
  Tv,
} from "lucide-react";
import { usePersonDetails } from "@/hooks/useMovies";
import { getImageUrl } from "@/lib/api";
import {
  calculateAge,
  formatBirthday,
  getSocialLinks,
  getKnownForCredits,
  processFilmography,
} from "@/lib/personHelpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import MovieCard from "@/components/Card/MovieCard";
import SEO from "@/components/SEO/SEO";
import VirtualFilmographyGrid from "@/components/VirtualFilmographyGrid/VirtualFilmographyGrid";
import defaultAvatar from "../../assets/avatar.jpg";

// Loading skeleton component
const PersonSkeleton = () => (
  <div className="min-h-screen">
    <div className="relative h-[45vh] min-h-[400px] bg-muted pt-20">
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <Skeleton className="w-48 h-48 rounded-full" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-40" />
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  </div>
);

// Error state component
const ErrorState = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Failed to load person details</h2>
        <p className="text-muted-foreground mb-4">
          This person may not exist or there was an error loading the data.
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={() => navigate(-1)}>Go Back</Button>
          <Link to="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Icon component mapper
interface SocialIconProps {
  iconName: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ iconName }) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    ExternalLink: ExternalLink,
    Instagram: Instagram,
    Twitter: Twitter,
  };
  const Icon = icons[iconName] || ExternalLink;
  return <Icon className="w-4 h-4" />;
};

// Main PersonPage component
const PersonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showFullBio, setShowFullBio] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const { data, isLoading, error } = usePersonDetails(id);

  // Handle loading and error states
  if (isLoading) return (
    <>
      <SEO />
      <PersonSkeleton />
    </>
  );
  if (error) return <ErrorState />;
  if (!data?.personDetails) return <ErrorState />;

  const { personDetails, combinedCredits, externalIds } = data;
  const socialLinks = getSocialLinks(externalIds);

  // Process filmography
  const knownForCredits = getKnownForCredits(combinedCredits, personDetails.known_for_department);
  const allFilmography = processFilmography(combinedCredits.cast, combinedCredits.crew);

  // Filter filmography based on active filter
  const filteredFilmography = allFilmography.filter((credit) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "acting") return credit.creditType === "cast";
    if (activeFilter === "directing") return credit.creditType === "crew" && credit.role === "Director";
    if (activeFilter === "producing") return credit.creditType === "crew" && (credit.role?.includes("Producer") || credit.department === "Production");
    if (activeFilter === "other") return credit.creditType === "crew" && credit.role !== "Director" && !credit.role?.includes("Producer");
    return true;
  });

  // Count credits by type
  const actingCount = allFilmography.filter(c => c.creditType === "cast").length;
  const directingCount = allFilmography.filter(c => c.creditType === "crew" && c.role === "Director").length;
  const producingCount = allFilmography.filter(c => c.creditType === "crew" && (c.role?.includes("Producer") || c.department === "Production")).length;
  const otherCount = allFilmography.filter(c => c.creditType === "crew" && c.role !== "Director" && !c.role?.includes("Producer")).length;

  // Determine if biography needs "Read More" toggle
  const bioTooLong = personDetails.biography && personDetails.biography.length > 500;
  const displayBio = showFullBio || !bioTooLong
    ? personDetails.biography
    : personDetails.biography?.substring(0, 500) + "...";

  // Profile image URL
  const profileImageUrl = personDetails.profile_path
    ? getImageUrl(personDetails.profile_path, "w342")
    : defaultAvatar;

  // Format birthday
  const birthdayDisplay = formatBirthday(
    personDetails.birthday,
    personDetails.deathday
  );

  return (
    <div className="min-h-screen">
      <SEO
        title={personDetails.name}
        description={
          personDetails.biography
            ? personDetails.biography.substring(0, 160) + "..."
            : `Explore ${personDetails.name}'s biography, filmography, and career highlights on MoviQ.`
        }
        image={personDetails.profile_path ? getImageUrl(personDetails.profile_path, "w500") : undefined}
        type="profile"
      />
      {/* Hero Section */}
      <div className="relative h-[45vh] min-h-[400px] bg-gradient-to-br from-primary/20 via-background to-background pt-20">
        {/* Back Button */}
        <div className="absolute top-24 left-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2 bg-background/20 backdrop-blur-md hover:bg-background/40"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Hero Content */}
        <div className="h-full flex flex-col items-center justify-center gap-4 px-4">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-48 h-48 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-2xl"
          >
            <img
              src={profileImageUrl}
              alt={personDetails.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-center"
          >
            {personDetails.name}
          </motion.h1>

          {/* Known For Badge */}
          {personDetails.known_for_department && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Badge variant="secondary" className="text-sm">
                <Briefcase className="w-3 h-3 mr-1" />
                {personDetails.known_for_department}
              </Badge>
            </motion.div>
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex gap-2"
            >
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${link.name} profile`}
                >
                  <Button variant="outline" size="sm" className="gap-2">
                    <SocialIcon iconName={link.icon} />
                    {link.name}
                  </Button>
                </a>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Biography */}
          <div className="lg:col-span-2 space-y-12">
            {/* Biography Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4">Biography</h2>
              {personDetails.biography ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {displayBio}
                  </p>
                  {bioTooLong && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFullBio(!showFullBio)}
                    >
                      {showFullBio ? "Show Less" : "Read More"}
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No biography available for {personDetails.name}.
                </p>
              )}
            </motion.section>

            {/* Known For Carousel */}
            {knownForCredits.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-6">Known For</h2>
                <div className="relative">
                  <Carousel opts={{ align: "start", dragFree: true }}>
                    <CarouselContent className="-ml-4" viewportClassName="px-4 -mx-4 py-4 -my-4">
                      {knownForCredits.map((credit) => (
                        <CarouselItem
                          key={`${credit.id}-${credit.media_type}`}
                          className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                        >
                          <MovieCard
                            id={credit.id}
                            image={credit.poster_path}
                            title={credit.title || credit.name}
                            type={credit.media_type}
                            rating={credit.vote_average}
                            year={
                              credit.release_date
                                ? new Date(credit.release_date).getFullYear()
                                : credit.first_air_date
                                  ? new Date(credit.first_air_date).getFullYear()
                                  : null
                            }
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </motion.section>
            )}

            {/* Filmography Section */}
            {allFilmography.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    Filmography
                    <Badge variant="secondary" className="ml-3">
                      {allFilmography.length}
                    </Badge>
                  </h2>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button
                    variant={activeFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter("all")}
                  >
                    All ({allFilmography.length})
                  </Button>
                  {actingCount > 0 && (
                    <Button
                      variant={activeFilter === "acting" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter("acting")}
                    >
                      Acting ({actingCount})
                    </Button>
                  )}
                  {directingCount > 0 && (
                    <Button
                      variant={activeFilter === "directing" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter("directing")}
                    >
                      Directing ({directingCount})
                    </Button>
                  )}
                  {producingCount > 0 && (
                    <Button
                      variant={activeFilter === "producing" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter("producing")}
                    >
                      Producing ({producingCount})
                    </Button>
                  )}
                  {otherCount > 0 && (
                    <Button
                      variant={activeFilter === "other" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter("other")}
                    >
                      Other ({otherCount})
                    </Button>
                  )}
                </div>

                {/* Virtual Filmography Grid */}
                {filteredFilmography.length > 0 ? (
                  <VirtualFilmographyGrid credits={filteredFilmography} />
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No {activeFilter !== "all" ? activeFilter : ""} credits found.
                  </p>
                )}
              </motion.section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Personal Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass rounded-xl p-6 space-y-4"
            >
              <h3 className="font-semibold text-lg">Personal Info</h3>

              {/* Known For Department */}
              {personDetails.known_for_department && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span>Known For</span>
                  </div>
                  <p className="font-medium">{personDetails.known_for_department}</p>
                </div>
              )}

              {/* Birthday */}
              {birthdayDisplay && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Birthday</span>
                  </div>
                  <p className="font-medium">{birthdayDisplay}</p>
                </div>
              )}

              {/* Place of Birth */}
              {personDetails.place_of_birth && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Place of Birth</span>
                  </div>
                  <p className="font-medium">{personDetails.place_of_birth}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonPage;
