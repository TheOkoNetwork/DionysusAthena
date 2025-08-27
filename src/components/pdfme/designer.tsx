"use client"

import { useRouter } from 'next/navigation';

// import { generate } from "@pdfme/generator";
import { Template, BLANK_A4_PDF } from "@pdfme/common"
import { Designer } from "@pdfme/ui";
import { useEffect, useState } from "react";
import { text, barcodes, image, table, date, rectangle, line, svg, time, dateTime, select, radioGroup, checkbox, ellipse, multiVariableText } from '@pdfme/schemas';

import Label from "@/components/form/Label";
import Input from '@/components/form/input/InputField';
import Button from "@/components/ui/button/Button"


import { toast } from 'react-toastify';


interface PDFMeDesignerProps {
    templateId?: string;
}

let d: Designer | null = null;

export default function PDFMeDesigner({ templateId }: PDFMeDesignerProps) {
    const [fontData, setFontData] = useState();
    const [template, setTemplate] = useState<Template | null>(null);
    const [templateName, setTemplateName] = useState('');
    const [templateEditable, setTemplateEditable] = useState(false);
     const router = useRouter();

    const saveTemplate = async function () {
        if (!d) {
            return;
        }
        console.log("Save/Edit pressed");
        if (!templateName) {
            return toast.error("Template name cannot be empty.");
        };

        const templateJson = d.getTemplate();
        // window.alert(JSON.stringify(templateJson));
        console.log(templateJson);

        if (templateId) {
            try {
                const saveResult = await fetch(`/api/request/UpdatePDFTemplate/${templateId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        templateName: templateName,
                        templateJson: JSON.stringify(templateJson),
                    }),
                }).then(r => r.json());
                console.log(saveResult);
                // window.alert(JSON.stringify(saveResult));
                if (saveResult.id) {
                    toast.success(`Successfully saved template: ${templateName}`);
                    router.push("/pdf-templates");
                }
            } catch (error) {
                console.log(error);
                toast.error("An unexpected error occurred saving this template");
            }
        } else {
            try {
                const createResult = await fetch(`/api/request/CreatePDFTemplate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        templateName: templateName,
                        templateJson: JSON.stringify(templateJson),
                    }),
                }).then(r => r.json());
                console.log(createResult);
                // window.alert(JSON.stringify(createResult));
                if (createResult.id) {
                    toast.success(`Successfully created template: ${templateName}`);
                    router.push("/pdf-templates");
                }
            } catch (error) {
                console.log(error);
                toast.error("An unexpected error occurred creating this template");
            }
        }

    }

    const deleteTemplate = async () => {
        console.log("Template delete called")
        if (!window.confirm("Are you sure you wish to delete this template?")) {
          return console.log("Not deleting");
        };
        window.alert("Now deleting");
        try {
          const response = await fetch(`/api/request/DeletePDFTemplate/${templateId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: null,
          });
    
          const result = await response.json();
    
          if (response.ok && result.deleted) {
            toast.success("PDF template deleted successfully!");
            router.push(`/pdf-templates`);
          } else {
              toast.error(result.error || "Failed to delete PDF template");
          }
        }
        catch (error) {
          console.error("Error deleting PDF template:", error);
          toast.error("An unexpected error occurred.");
        }
      };
    useEffect(() => {
        if (!templateId) {
            setTemplateEditable(true);
            setTemplate({
                basePdf: BLANK_A4_PDF,
                schemas: [
                    [],
                ],
            });
        } else {
            fetch(`/api/request/GetPDFTemplate/${templateId}`).then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    setTemplateEditable(Boolean(data.organiser_id));
                    setTemplate(JSON.parse(data.template));
                    setTemplateName(data.name);
                });
        };
    }, [templateId]);


    useEffect(() => {
        fetch('/api/request/GetPDFFonts').then((res) => res.json())
            .then((data) => {
                setFontData(data);
            });
    }, []);

    useEffect(() => {
        if (!fontData) {
            return;
        }
        if (!template) {
            return;
        }
        d = new Designer({
            template,
            domContainer: document.getElementById("pdfme-container") as HTMLElement,
            options: {
                font: fontData,
            },
            plugins: {
                text,
                image,
                qrcode: barcodes.qrcode,
                table,
                rectangle,
                'Multi-Variable Text': multiVariableText,
                Line: line,
                Ellipse: ellipse,
                SVG: svg,
                DateTime: dateTime,
                Date: date,
                Time: time,
                Select: select,
                Checkbox: checkbox,
                RadioGroup: radioGroup,
                JAPANPOST: barcodes.japanpost,
                EAN13: barcodes.ean13,
                EAN8: barcodes.ean8,
                Code39: barcodes.code39,
                Code128: barcodes.code128,
                NW7: barcodes.nw7,
                ITF14: barcodes.itf14,
                UPCA: barcodes.upca,
                UPCE: barcodes.upce,
                GS1DataMatrix: barcodes.gs1datamatrix,
                PDF417: barcodes.pdf417,
            }
        });
    }, [fontData, template]);


    return (

        <div>

            <div className="space-y-6">
                <div>
                    <Label>Name</Label>
                    <Input type="text" disabled={!templateEditable} defaultValue={templateName} onChange={(e) => setTemplateName(e.target.value)} />
                </div>
            </div>

            {templateEditable && (
                <div className="space-y-6">
                    <div>
                        {templateId && (
                            <>
                                <Button onClick={saveTemplate}>
                                    Save template
                                </Button>
                                <Button onClick={deleteTemplate}>
                                    Delete template
                                </Button>
                            </>
                        )}

                        {!templateId && (
                            <>
                                <Button onClick={saveTemplate}>
                                    Create template
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div id="pdfme-container"></div>
        </div>

    )
}