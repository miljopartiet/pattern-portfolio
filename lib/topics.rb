# encoding: UTF-8
class Topics

  def self.in_groups
    self.all.group_by { |topic| topic[0].upcase }
  end

  def self.all
    [
      "Alkoholpolitik",
      "Antidiskriminering",
      "Arbetskraftsinvandring",
      "Arbetslivstrygghet",
      "Arbetslöshet",
      "Arbetsmarknad",
      "Arbetsmiljö",
      "Arbetsrätt",
      "Arbetstidsförkortning",
      "Barn och ungdom",
      "Bensinpris",
      "Betyg",
      "Bibliotek och museer",
      "Biologisk mångfald",
      "Bistånd och utvecklingssamarbete",
      "Boinflytande",
      "Bostad",
      "Civil olydnad",
      "Cykel",
      "Deltagande demokrati",
      "Demokrati",
      "Demokrati och media",
      "Diskriminering",
      "Djur i lantbruket",
      "Djurcirkus",
      "Djurförsök",
      "Djurporr",
      "Djurrätt",
      "E-Demokrati",
      "Egenvård",
      "Ekologiskt lantbruk",
      "Elevinflytande",
      "EMU",
      "Energi",
      "Energieffektivisering",
      "Entreprenörskap",
      "Etiska regler för politiker",
      "EU",
      "EU och demokratin",
      "EU och fiskepolitiken",
      "EU och flyktingpolitiken",
      "EU och jordbrukspolitiken",
      "EU och miljön",
      "EU och utvidgningen",
      "EU:s budget",
      "EU:s utrikes- och säkerhetspolitik",
      "Euron",
      "Europeiska Unionen",
    ]
  end
end

