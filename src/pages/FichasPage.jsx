import './styles/Fichas.css';
import  React, { useState, useRef } from 'react';
import { usePDF } from 'react-to-pdf';

const FichasPage = () => {
    const [textos, setTextos] = useState(`Ma,Me,Mi,Mo,Mu,ma,me,mi,mo,mu`)
    const [fontSize, setFontSize] = useState(120);
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [letterStyles, setLetterStyles] = useState({inicial: {marginTop: -34, fontFamily: 'Deuxieme Rang'}});
    const [initials, setInitials] = useState("I.J.L.B.");
    const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});
    const handlePrint = () => {
        window.print();
    };

    const handleExportToPdf = () => {
        toPDF();
    }

    const handleLetterClick = (index, part) => {
        setSelectedLetter({ index, part });
    };

    const handleStyleChange = (property, value) => {
        if (selectedLetter) {
            const { index, part } = selectedLetter;
            setLetterStyles((prev) => {
                const newStyles = {
                    ...prev,
                    [`${index}-${part}`]: {
                        ...prev[`${index}-${part}`],
                        [property]: value,
                    },
                };
                return newStyles;
            });
        }
    };

    const handleInitialStyleChange = (property, value) => {
        setLetterStyles((prev) => ({
            ...prev,
            ["inicial"]: {
                ...prev["inicial"],
                [property]: value
            }
        }));
    };

    const handleExportConfig = () => {
        const config = {
            textos,
            fontSize,
            letterStyles,
            initials
        };
    
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "fichas-config.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };
    
    const handleImportConfig = (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            try {
                const importedConfig = JSON.parse(e.target.result);
                setTextos(importedConfig.textos || '');
                setFontSize(importedConfig.fontSize || 120);
                setLetterStyles(importedConfig.letterStyles || {});
                setInitials(importedConfig.initials || '');
            } catch (error) {
                alert("Error al importar la configuración: " + error.message);
            }
    
            // 🔧 Reiniciar el input para permitir reimportar el mismo archivo
            event.target.value = null;
        };
        fileReader.readAsText(file);
    };

    return (
        <div className="contenedor-principal">
            <button onClick={handlePrint} className="boton-imprimir">Imprimir</button>
            <button onClick={handleExportToPdf} className="boton-imprimir"> Exportar PDF</button>
            <button onClick={handleExportConfig} className="boton-imprimir btn btn-success"><i className='fa fa-file'></i> <i class="bi bi-file-earmark-arrow-down"></i> Exportar Configuración</button>
            <label className="boton-imprimir btn btn-warning">
                <i class="bi bi-file-earmark-arrow-up"></i> Importar Configuración
                <input
                    type="file"
                    accept="application/json"
                    style={{ display: 'none' }}
                    onChange={handleImportConfig}
                />
            </label>
            <label>Textos:
            <input 
                type="text" 
                value={textos} 
                onChange={(e) => setTextos(e.target.value)} 
                placeholder="Ingrese iniciales"
            />
            </label>
            <label className="tamanio-letra">
                Tamaño de letra:
                <input 
                    type="number" 
                    value={fontSize} 
                    onChange={(e) => setFontSize(e.target.value)} 
                />
            </label>
            {selectedLetter && (
                <div className="config-panel">
                    <label>Color:
                        <select 
                            value={letterStyles[`${selectedLetter.index}-${selectedLetter.part}`]?.color || "#2F5496"}
                            onChange={(e) => handleStyleChange("color", e.target.value)}
                        >
                            <option value="#2F5496">Azul</option>
                            <option value="#C00000">Rojo</option>
                            <option value="#000000">Negro</option>
                        </select>
                    </label>
                    <label>Tamaño:
                        <input 
                            type="number" 
                            value={parseInt(letterStyles[`${selectedLetter.index}-${selectedLetter.part}`]?.fontSize) || "48"}
                            onChange={(e) => handleStyleChange("fontSize", e.target.value + "px")}
                        />
                    </label>
                    <label>Fuente:
                        <select 
                            value={letterStyles[`${selectedLetter.index}-${selectedLetter.part}`]?.fontFamily || "Deuxieme Rang"}
                            onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
                        >
                            <option value="Deuxieme Rang">Deuxieme Rang</option>
                            <option value="MamaeQueNosFaz">MamaeQueNosFaz</option>
                        </select>
                    </label>
                </div>
            )}
            {selectedLetter?.part === "inicial" && (
    <div className="config-panel">
        <h3>Configuración de Iniciales</h3>

        <label>Color:
            <input 
                type="color" 
                value={letterStyles["inicial"]?.color || "#2F5496"}
                onChange={(e) => handleInitialStyleChange("color", e.target.value)}
            />
        </label>

        <label>Tamaño:
            <input 
                type="number" 
                value={parseInt(letterStyles["inicial"]?.fontSize) || "24"}
                onChange={(e) => handleInitialStyleChange("fontSize", e.target.value + "px")}
            />
        </label>

        <label>Fuente:
            <select 
                value={letterStyles["inicial"]?.fontFamily || "Arial"}
                onChange={(e) => handleInitialStyleChange("fontFamily", e.target.value)}
            >
                <option value="Arial">Arial</option>
                <option value="Deuxieme Rang">Deuxieme Rang</option>
                <option value="MamaeQueNosFaz">MamaeQueNosFaz</option>
            </select>
        </label>
        <label>Texto:
            <input 
                type="text" 
                value={initials} 
                onChange={(e) => setInitials(e.target.value)} 
                placeholder="Ingrese iniciales"
            />
        </label>
        <label>Margen superior:
            <input 
                type="range" 
                className="form-range"
                min="-100"
                max="100"
                value={parseInt(letterStyles["inicial"]?.marginTop) || "-46"}
                onChange={(e) => handleInitialStyleChange("marginTop", e.target.value + "px")}
            />
        </label>
    </div>
)}

            <div id="print-area" className="contenedor-fichas"  ref={targetRef}>
                {textos.split(',').map((texto, index) => (
                    <div key={index} className="mica">
    <div className="recuadro">
        <div className="silaba-container">
            {/* Sílabas */}
            <span className={`silaba ${texto.charAt(0) === texto.charAt(0).toUpperCase() ? 'mayuscula' : 'minuscula'}`} style={{ fontSize: `${fontSize}px` }}>
                <span 
                    className="primera" 
                    style={(letterStyles[`${index}-primera`] || { color: (texto.charAt(0) === texto.charAt(0).toUpperCase() ? '#C00000' : '#2F5496') })}
                    onClick={() => handleLetterClick(index, "primera")}
                >
                    {texto.charAt(0)}
                </span>
                <span 
                    className="segunda" 
                    style={letterStyles[`${index}-segunda`] || { color: "#2F5496" }}
                    onClick={() => handleLetterClick(index, "segunda")}
                >
                    {texto.charAt(1)}
                </span>
            </span>
            
            {/* Inicial debajo */}
            <span 
                className="iniciales"
                style={letterStyles["inicial"] || { fontSize: "24px", color: "gray" }}
                onClick={() => setSelectedLetter({ part: "inicial" })}
            >
                {initials}
            </span>
        </div>
    </div>
</div>

                ))}
            </div>
        </div>
    );
}

export default FichasPage;
