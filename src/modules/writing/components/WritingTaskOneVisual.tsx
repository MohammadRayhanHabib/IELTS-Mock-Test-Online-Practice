import React from "react";

const Legend: React.FC<{ swatch: string; label: string; value: string }> = ({
  swatch,
  label,
  value,
}) => (
  <li className="flex items-center gap-2">
    <span className={`h-3 w-3 border border-gray-700 ${swatch}`} />
    <span className="flex-1">{label}</span>
    <strong>{value}</strong>
  </li>
);

const LibrarySurveyVisual: React.FC = () => (
  <figure className="mx-auto mt-8 w-full max-w-[560px] pb-8" aria-labelledby="library-survey-caption">
    <figcaption id="library-survey-caption" className="text-center text-sm font-bold">Categories of library users</figcaption>
    <div className="mx-auto mt-5 grid max-w-[510px] items-center gap-6 sm:grid-cols-[240px_1fr]">
      <div className="mx-auto h-[210px] w-[210px] rounded-full border border-gray-700" style={{ background: "conic-gradient(#ffffff 0 44%, #a8a8a8 44% 69%, #dedede 69% 85%, #4a4a4a 85% 93%, #737373 93% 100%)" }} aria-label="Pie chart: full-time undergraduate 44 percent, full-time postgraduate 25 percent, part-time postgraduate 16 percent, distance learning 8 percent and academic staff 7 percent" />
      <ul className="space-y-2 text-xs leading-5">
        <Legend swatch="bg-white" label="Full-time undergraduate" value="44%" />
        <Legend swatch="bg-[#a8a8a8]" label="Full-time postgraduate" value="25%" />
        <Legend swatch="bg-[#dedede]" label="Part-time postgraduate" value="16%" />
        <Legend swatch="bg-[#4a4a4a]" label="Distance learning" value="8%" />
        <Legend swatch="bg-[#737373]" label="Academic staff" value="7%" />
      </ul>
    </div>
    <table className="mt-8 w-full border-collapse text-[11px]" aria-label="Library user satisfaction percentages">
      <caption className="border border-b-0 border-gray-700 py-1.5 font-bold">Library user satisfaction (%)</caption>
      <thead><tr><th className="border border-gray-700 px-2 py-1 text-left">Service</th><th className="border border-gray-700 px-2 py-1">Very satisfied</th><th className="border border-gray-700 px-2 py-1">Fairly satisfied</th><th className="border border-gray-700 px-2 py-1">Not satisfied</th></tr></thead>
      <tbody>
        {[["Library opening hours", 65, 35, 0], ["Helpfulness of staff", 95, 5, 0], ["Availability of books", 50, 40, 10], ["Availability of journals", 45, 35, 20], ["Reliability of wi-fi", 48, 33, 19]].map(([label, very, fairly, notSatisfied]) => (
          <tr key={String(label)}><td className="border border-gray-700 px-2 py-1">{label}</td><td className="border border-gray-700 px-2 py-1 text-center">{very}</td><td className="border border-gray-700 px-2 py-1 text-center">{fairly}</td><td className="border border-gray-700 px-2 py-1 text-center">{notSatisfied}</td></tr>
        ))}
      </tbody>
    </table>
  </figure>
);

const WritingTaskOneVisual: React.FC<{ testNumber: number }> = ({ testNumber }) => {
  if (testNumber === 1) return <LibrarySurveyVisual />;
  if (testNumber === 2) {
    return (
      <figure className="mx-auto mt-8 w-full max-w-[590px] pb-8" aria-label="Household energy use and greenhouse gas emissions comparison">
        <figcaption className="text-center text-sm font-bold">Household energy use and greenhouse-gas emissions (%)</figcaption>
        <div className="mt-6 grid gap-7 sm:grid-cols-2">
          {[{ title: "Country A", values: [34, 28, 22, 16] }, { title: "Country B", values: [24, 36, 18, 22] }].map((country) => (
            <section key={country.title} className="border border-gray-500 p-4">
              <h3 className="text-center text-sm font-bold">{country.title}</h3>
              <div className="mt-4 space-y-3 text-xs">
                {country.values.map((value, index) => <div key={index} className="grid grid-cols-[78px_1fr_32px] items-center gap-2"><span>{["Heating", "Transport", "Appliances", "Other"][index]}</span><span className="h-4 bg-gray-200"><span className="block h-full bg-[#7f1d1d]" style={{ width: `${value}%` }} /></span><strong>{value}</strong></div>)}
              </div>
            </section>
          ))}
        </div>
      </figure>
    );
  }
  if (testNumber === 3) {
    return (
      <figure className="mx-auto mt-8 w-full max-w-[600px] pb-8" aria-label="Glass bottle recycling process">
        <figcaption className="text-center text-sm font-bold">Recycling discarded glass bottles</figcaption>
        <div className="mt-6 grid grid-cols-2 gap-4 text-center text-xs sm:grid-cols-4">
          {["Collection bins", "Colour sorting", "Crushing & washing", "Furnace melting", "New bottles", "Quality check", "Distribution", "Reuse"].map((step, index) => <div key={step} className="relative flex min-h-20 items-center justify-center border border-gray-600 bg-gray-50 p-3 font-semibold"><span className="absolute left-2 top-1 text-[10px] text-gray-500">{index + 1}</span>{step}{index < 7 ? <span className="absolute -right-3 z-10 text-lg">→</span> : null}</div>)}
        </div>
      </figure>
    );
  }
  return (
    <figure className="mx-auto mt-8 w-full max-w-[590px] pb-8" aria-label="Public transport trips in three cities">
      <figcaption className="text-center text-sm font-bold">Annual public-transport trips per resident</figcaption>
      <table className="mt-5 w-full border-collapse text-xs"><thead><tr><th className="border border-gray-600 p-2 text-left">City</th><th className="border border-gray-600 p-2">2005</th><th className="border border-gray-600 p-2">2015</th><th className="border border-gray-600 p-2">2025</th></tr></thead><tbody>{[["Northport", 82, 105, 136], ["Lake City", 64, 78, 97], ["Westhaven", 91, 88, 112]].map((row) => <tr key={String(row[0])}>{row.map((cell, index) => <td key={index} className={`border border-gray-600 p-2 ${index ? "text-center" : "font-semibold"}`}>{cell}</td>)}</tr>)}</tbody></table>
      <div className="mt-5 flex h-36 items-end justify-around border-b border-l border-gray-600 px-5">{[82, 136, 64, 97, 91, 112].map((value, index) => <div key={index} className="w-10 bg-[#7f1d1d] text-center text-[10px] text-white" style={{ height: `${value * 0.85}px` }}>{value}</div>)}</div>
    </figure>
  );
};

export default WritingTaskOneVisual;
