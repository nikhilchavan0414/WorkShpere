package com.hrms.util;

import com.hrms.entity.Payroll;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Component;

import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class PdfGenerator {

    private static final String PAYSLIP_DIR = "payslips";

    public String generatePayslip(Payroll payroll, String payslipNumber) {
        try {
            Path dir = Paths.get(PAYSLIP_DIR);
            if (!Files.exists(dir)) {
                Files.createDirectories(dir);
            }

            String fileName = payslipNumber + ".pdf";
            String filePath = PAYSLIP_DIR + "/" + fileName;

            Document document = new Document();
            PdfWriter.getInstance(document, new FileOutputStream(filePath));
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 11);

            Paragraph title = new Paragraph("PAYSLIP", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Payslip No: " + payslipNumber, normalFont));
            document.add(new Paragraph("Employee: " + payroll.getEmployee().getFirstName() + " "
                    + payroll.getEmployee().getLastName(), normalFont));
            document.add(new Paragraph("Employee ID: " + payroll.getEmployee().getEmployeeId(), normalFont));
            document.add(new Paragraph("Period: " + payroll.getMonth() + "/" + payroll.getYear(), normalFont));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);

            addRow(table, "Basic Salary", payroll.getBasicSalary().toString(), headerFont, normalFont);
            addRow(table, "HRA", payroll.getHra().toString(), headerFont, normalFont);
            addRow(table, "DA", payroll.getDa().toString(), headerFont, normalFont);
            addRow(table, "Bonus", payroll.getBonus().toString(), headerFont, normalFont);
            addRow(table, "Allowances", payroll.getAllowances().toString(), headerFont, normalFont);
            addRow(table, "Gross Salary", payroll.getGrossSalary().toString(), headerFont, normalFont);
            addRow(table, "PF", payroll.getPf().toString(), headerFont, normalFont);
            addRow(table, "Tax", payroll.getTax().toString(), headerFont, normalFont);
            addRow(table, "Other Deductions", payroll.getOtherDeductions().toString(), headerFont, normalFont);
            addRow(table, "Net Salary", payroll.getNetSalary().toString(), headerFont, normalFont);

            document.add(table);
            document.close();

            return filePath;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate payslip PDF", e);
        }
    }

    private void addRow(PdfPTable table, String label, String value, Font headerFont, Font normalFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, headerFont));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPadding(5);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, normalFont));
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setPadding(5);
        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(valueCell);
    }
}
