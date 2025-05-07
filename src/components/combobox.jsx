import { useEffect, useId, useMemo, useRef, useState } from "react";

export const ComboBox = ({
  options,
  value,
  onChange,
  containerStyle = {},
  boxStyle = {},
}) => {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const comboBoxRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggle = () => {
    const rect = comboBoxRef.current.getBoundingClientRect();
    dropdownRef.current.style.width = `${rect.width}px`;
    dropdownRef.current.style.top = `${rect.top + rect.height + 8}px`;
    dropdownRef.current.style.left = `${rect.left}px`;
    setIsOpen(!isOpen);
  };
  const [search, setSearch] = useState("");
  // const filteredOptions = useMemo(() => {
  // 	return (options || [])
  // 		.filter((option) =>
  // 			option?.name.toLowerCase().includes(search.toLowerCase()),
  // 		)
  // 		?.filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i)
  // }, [search, options])
  const filteredOptions = useMemo(() => {
    return (options || [])
      .filter(
        (option) =>
          option &&
          option.name &&
          option.name.toLowerCase().includes(search.toLowerCase())
      )
      .filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i);
  }, [search, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (comboBoxRef.current && !comboBoxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && comboBoxRef.current && dropdownRef.current) {
        const rect = comboBoxRef.current.getBoundingClientRect();
        dropdownRef.current.style.width = `${rect.width}px`;
        dropdownRef.current.style.top = `${rect.top + rect.height + 8}px`;
        dropdownRef.current.style.left = `${rect.left}px`;
      }
    };

    const handleClickOutside = (event) => {
      if (comboBoxRef.current && !comboBoxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={comboBoxRef} style={containerStyle}>
      <button
        type="button"
        className="bg-white px-3 py-1 border-2 rounded flex gap-2 items-center justify-between w-full border-[#203764]"
        s
        onClick={toggle}
      >
        <div className="overflow-hidden truncate">
          {(options || []).find((option) => option.id == value)?.name ||
            "Select ..."}
        </div>
        <span className="mdi mdi-chevron-down text-xl" />
      </button>
      <div
        className={[
          isOpen ? "fixed" : "hidden",
          " rounded border-2 border-[#203764] bg-white max-w-ful z-50",
        ].join(" ")}
        ref={dropdownRef}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ..."
          className="rounded-0 w-full !border-t-0 !border-x-0 mb-0"
        />
        <div className="max-h-[100px] overflow-auto">
          {filteredOptions.length ? (
            filteredOptions.map((option) => (
              <button
                key={`cbx_${id}_${option.id}`}
                type="button"
                className="w-full text-left px-2 py-1 hover:bg-gray-200 flex items-center"
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
              >
                <span
                  className="mdi mdi-check mr-2 text-xl"
                  style={{ opacity: `${value == option.id ? "100" : "0"}%` }}
                />
                {option.name}
              </button>
            ))
          ) : (
            <div className="text-center px-3 py-2">No Data found</div>
          )}
        </div>
      </div>
    </div>
  );
};
