const QRCode = require('qrcode');
const fs = require('fs');

/**
 * Genera un código QR de contacto con información personalizada
 * @param {Object} contactInfo - Información del contacto
 * @param {string} contactInfo.firstName - Primer nombre
 * @param {string} contactInfo.lastName - Apellido
 * @param {string} [contactInfo.organization] - Organización (opcional)
 * @param {string} [contactInfo.title] - Cargo (opcional)
 * @param {string} contactInfo.phone - Número de teléfono
 * @param {string} [contactInfo.email] - Correo electrónico (opcional)
 * @param {Object} [qrOptions] - Opciones de configuración del código QR
 * @returns {Promise} - Promesa que resuelve cuando se genera el código QR
 */
function generateContactQR(contactInfo, qrOptions = {}) {
    // Validar campos requeridos
    if (!contactInfo.firstName || !contactInfo.lastName || !contactInfo.phone) {
        throw new Error('Nombre, apellido y teléfono son obligatorios');
    }

    // Configuración predeterminada del código QR
    const defaultQROptions = {
        color: {
            dark: '#0000FF', // Azul oscuro (contenido del QR)
            light: '#FFFFFF' // Blanco (fondo del QR)
        },
        width: 256 // Tamaño en píxeles
    };

    // Combinar opciones predeterminadas con opciones personalizadas
    const finalQROptions = { ...defaultQROptions, ...qrOptions };

    // Construir vCard
    const contactDetails = `BEGIN:VCARD
VERSION:3.0
N:${contactInfo.lastName};${contactInfo.firstName};;;
FN:${contactInfo.firstName} ${contactInfo.lastName}
${contactInfo.organization ? `ORG:${contactInfo.organization}` : ''}
${contactInfo.title ? `TITLE:${contactInfo.title}` : ''}
TEL;TYPE=CELL,VOICE:${contactInfo.phone}
${contactInfo.email ? `EMAIL;TYPE=PREF,INTERNET:${contactInfo.email}` : ''}
END:VCARD`;

    // Generar nombre de archivo
    const fileName = `${contactInfo.lastName}_${contactInfo.firstName}.png`;
    const filePath = `./files/${fileName}`;

    // Retornar una promesa para manejar la generación del código QR
    return new Promise((resolve, reject) => {
        QRCode.toFile(filePath, contactDetails, finalQROptions, (err) => {
            if (err) {
                reject(new Error(`Error al generar el código QR: ${err.message}`));
            } else {
                resolve({
                    message: `Código QR generado exitosamente: ${fileName}`,
                    filePath: filePath
                });
            }
        });
    });
}

// Ejemplo de uso
async function main() {
    try {
        // Ejemplo 1: Información completa
        const result1 = await generateContactQR({
            firstName: 'Ian',
            lastName: 'Webb',
            organization: 'Pacific RE',
            title: 'CEO',
            phone: '+57 312 354 4999',
            email: 'ian.webb@pacificre.com.co'
        });
        console.log(result1.message);

        // Ejemplo 2: Información mínima
        const result2 = await generateContactQR({
            firstName: 'Maria',
            lastName: 'Garcia',
            phone: '+57 311 222 3333'
        });
        console.log(result2.message);

        // Ejemplo 3: Personalizar color del QR
        const result3 = await generateContactQR(
            {
                firstName: 'Carlos',
                lastName: 'Rodriguez',
                phone: '+57 310 444 5555',
                email: 'carlos.rodriguez@example.com'
            },
            {
                color: {
                    dark: '#FF0000', // Rojo
                    light: '#FFFF00'  // Amarillo
                },
                width: 300
            }
        );
        console.log(result3.message);

    } catch (error) {
        console.error(error.message);
    }
}

// Ejecutar el script
main();
