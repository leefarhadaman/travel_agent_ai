import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Itinerary } from './types';

export const downloadItineraryPDF = async (itinerary: Itinerary) => {
    try {
        const element = document.getElementById('itinerary-content');
        if (!element) {
            alert('Could not find itinerary content');
            return;
        }

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= 297;
        }

        pdf.save(`${itinerary.toCity}-itinerary.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF');
    }
};
