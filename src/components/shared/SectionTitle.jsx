const SectionTitle = ({ title, subtitle, center = true }) => (
  <div className={`mb-10 ${center ? 'text-center' : ''}`}>
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
    {subtitle && (
      <p className={`text-gray-500 mt-3 max-w-2xl ${center ? 'mx-auto' : ''}`}>{subtitle}</p>
    )}
    <div className={`h-1 w-20 bg-blue-600 rounded-full mt-4 ${center ? 'mx-auto' : ''}`} />
  </div>
);

export default SectionTitle;
