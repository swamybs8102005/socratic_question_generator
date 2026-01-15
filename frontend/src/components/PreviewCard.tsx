import previewImage from "@/assets/preview-dashboard.png";

const PreviewCard = () => {
  return (
    <div
      className="hidden lg:block absolute right-[10%] bottom-[25%] w-[360px] h-[240px] 
                 rounded-2xl overflow-hidden
                 bg-glass border border-glass-border backdrop-blur-xl
                 transition-all duration-350 ease-out
                 hover:-translate-y-2 hover:scale-[1.02] 
                 hover:border-accent/40 hover:bg-glass-hover
                 hover:shadow-glow-lg
                 animate-float"
    >
      <img
        src={previewImage}
        alt="Vidyayathra Dashboard Preview"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default PreviewCard;
