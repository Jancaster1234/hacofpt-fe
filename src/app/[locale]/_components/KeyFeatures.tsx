// src/app/[locale]/_components/KeyFeatures.tsx
const features = [
  {
    title: "Quick Registration",
    description: "Simple forms to collect essential data.",
  },
  {
    title: "Transparent Evaluation",
    description: "Scores and feedback from judges directly.",
  },
];

const KeyFeatures = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-800">Key Features</h2>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
