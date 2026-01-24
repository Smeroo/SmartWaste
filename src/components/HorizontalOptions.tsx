"use client";

import { useState } from 'react';

// Props per il componente HorizontalOptions
interface HorizontalOptionsProps {
    options: string[]; // Lista delle etichette delle opzioni
    initialSelected?: number; // Indice dell'opzione selezionata inizialmente
    backgroundColor?: string; // Colore di sfondo per il rettangolo mobile
    optionClassName?: string; // Classe aggiuntiva per ogni opzione
    containerClassName?: string; // Classe aggiuntiva per il contenitore
    layout?: 'row' | 'grid'; // Tipo di layout: riga o griglia
    onOptionSelect?: (selectedOption: string) => void; // Callback quando viene selezionata un'opzione
}

// Componente HorizontalOptions per visualizzare opzioni selezionabili in riga o griglia
const HorizontalOptions: React.FC<HorizontalOptionsProps> = ({
    options,
    initialSelected = 0,
    backgroundColor = 'bg-stone-100',
    optionClassName = '',
    containerClassName = '',
    layout = 'row',
    onOptionSelect,
}) => {
    // Stato per l'indice dell'opzione attualmente selezionata
    const [selectedOption, setSelectedOption] = useState<number>(initialSelected);

    // Gestisce il click su un'opzione
    const handleOptionClick = (index: number) => {
        setSelectedOption(index);
        if (onOptionSelect) {
            onOptionSelect(options[index]);
        }
    };

    // Stile per il rettangolo mobile nel layout a riga
    const getRowRectangleStyle = () => ({
        width: `${100 / options.length}%`,
        transform: `translateX(${selectedOption * 100}%)`,
    });

    // Stile per il rettangolo mobile nel layout a griglia
    const getGridRectangleStyle = () => {
        let column = selectedOption % 3;
        let row = Math.floor(selectedOption / 3);

        if (selectedOption === 0) {
            column = 0;
            row = 0;
        } else if (selectedOption === 1) {
            column = 1;
            row = 0;
        } else if (selectedOption === 2) {
            column = 2;
            row = 0;
        } else if (selectedOption === 3) {
            column = 1;
            row = 1;
        } else if (selectedOption === 4) {
            column = 2;
            row = 1;
        }

        return {
            width: '33.33%',
            height: selectedOption === 0 ? '100%' : '50%',
            transform: `translate(${column * 100}%, ${row * 100}%)`,
        };
    };

    // Renderizza layout a riga
    if (layout === 'row') {
        return (
            <div className={`relative grid grid-cols-5 items-center ${containerClassName}`}> {/* Usa griglia con 5 colonne */}
                {/* Rettangolo colorato che si muove sotto l'opzione selezionata */}
                <div
                    className={`absolute top-0 left-0 h-full rounded-2xl transition-all duration-500 ${backgroundColor}`}
                    style={{
                        width: `${100 / options.length}%`,
                        transform: `translateX(${selectedOption * 100}%)`,
                    }}
                ></div>

                {/* Etichette opzioni */}
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={`relative text-center cursor-pointer z-10 ${optionClassName}`}
                        onClick={() => handleOptionClick(index)}>
                        {option}
                    </div>
                ))}
            </div>
        );
    }

    // Renderizza layout a griglia
    if (layout === 'grid') {
        return (
            <div className={`relative grid grid-cols-3 grid-rows-2 gap-2 items-center ${containerClassName}`}>
                <div
                    className={`absolute top-0 left-0 rounded-2xl transition-all duration-500 ${backgroundColor}`}
                    style={getGridRectangleStyle()}
                ></div>
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={`relative text-center cursor-pointer z-10 ${optionClassName} 
                        ${index === 0 ? 'row-span-2' : ''}`}
                        onClick={() => handleOptionClick(index)}
                    >
                        {option}
                    </div>
                ))}
            </div>
        );
    }

    // Fallback se il layout non è riconosciuto
    return null;
};

export default HorizontalOptions;