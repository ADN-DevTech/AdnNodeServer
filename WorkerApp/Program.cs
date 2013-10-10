/////////////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved 
// Written by Philippe Leefsma 2013 - ADN/Developer Technical Services
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted, 
// provided that the above copyright notice appears in all copies and 
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting 
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS. 
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC. 
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////////////////
using System;
using System.IO;
using Newtonsoft.Json;

namespace WorkerApp
{
    class Program
    {
        [STAThread]
        static int Main(string[] args)
        {
            try
            {
                string inputFile = args[0];
                string outputFile = args[1];

                using (ApplicationWrapper app = ApplicationWrapper.Create())
                {
                    if (!File.Exists(inputFile))
                    {
                        Console.Error.WriteLine("Unable to locate file: " + inputFile);
                        Environment.Exit(1);
                    }

                    global::Inventor.ApprenticeServerDocument document =
                        app.Server.Open(inputFile);

                    if (document == null)
                    {
                        Console.Error.WriteLine("Unable to open document...");
                        Environment.Exit(2);
                    }

                    global::Inventor.PartComponentDefinition definition =
                        document.ComponentDefinition
                            as global::Inventor.PartComponentDefinition;

                    ModelData model = new ModelData(app.Server, document);

                    document.Close();

                    string json = JsonConvert.SerializeObject(
                        model,
                        Formatting.Indented);

                    File.WriteAllText(outputFile, json);

                    return 0;
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
                Environment.Exit(3);
                return 3;
            }
        }
    }
}
