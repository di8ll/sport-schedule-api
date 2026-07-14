import { sportsData } from "../data/sportsData";

const CategorySelector = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-4 justify-center">
        {Object.entries(sportsData).map(([key, data]) => {
          const active = selectedCategory === key;
          return (
            <button
              key={key}
              onClick={() => onCategoryChange(key)}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-300 border"
              style={
                active
                  ? {
                      backgroundColor: `${data.accent}22`,
                      color: data.accent,
                      borderColor: `${data.accent}80`,
                    }
                  : {
                      backgroundColor: "rgba(31,41,55,0.5)",
                      color: "#d1d5db",
                      borderColor: "rgba(75,85,99,0.5)",
                    }
              }
            >
              <span className="text-xl mr-2">{data.icon}</span>
              {data.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
