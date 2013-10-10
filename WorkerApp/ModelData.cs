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
using System.Runtime.Serialization;
using System.Runtime.InteropServices;
using System.Drawing;
using System.IO;
using Inventor;

namespace WorkerApp
{
    public class ModelData
    {
        public string Name 
        { 
            get; 
            set; 
        }

        public string Author
        {
            get;
            set;
        }

        public string CreationTime
        {
            get;
            set;
        }

        public string Material
        {
            get;
            set;
        }

        public byte[] Thumbnail
        {
            get;
            set;
        }

        public ModelData(
            ApprenticeServerComponent app,
            ApprenticeServerDocument doc)
        {
            Name = doc.DisplayName;

            Author = doc.
                PropertySets["{F29F85E0-4FF9-1068-AB91-08002B27B3D9}"].
                get_ItemByPropId(4).
                Expression;

            CreationTime = doc.
                PropertySets["{32853F0F-3444-11D1-9E93-0060B03C1CA6}"].
                get_ItemByPropId(4).
                Expression;

            Material = doc.
               PropertySets["{32853F0F-3444-11D1-9E93-0060B03C1CA6}"].
               get_ItemByPropId(20).
               Expression;

            Thumbnail = GetThumbnail(app, doc, 400, 400);
        }

        [DllImport(
            "oleaut32.dll",
            EntryPoint = "OleSavePictureFile",
            ExactSpelling = true,
            PreserveSig = false,
            SetLastError = true)]
        public static extern void OleSavePictureFile(
            stdole.IPictureDisp Picture,
            [MarshalAs(UnmanagedType.BStr)] string filename);

        byte[] GetThumbnail(
            ApprenticeServerComponent app, 
            ApprenticeServerDocument doc,
            int width,
            int height)
        {
            Camera camera = app.TransientObjects.CreateCamera();

            camera.SceneObject = doc.ComponentDefinition;

            TransientGeometry Tg = app.TransientGeometry;

            camera.Target = Tg.CreatePoint(0, 0, 0);
            camera.Eye = Tg.CreatePoint(-10, 10, 10);
            camera.UpVector = Tg.CreateUnitVector(0, 1, 0);

            camera.Fit();
            camera.ApplyWithoutTransition();

            //stdole.IPictureDisp pic = doc.Thumbnail;
            stdole.IPictureDisp pic = camera.CreateImage(width, height);

            string filename = System.IO.Path.GetTempFileName();

            //Temp file is a .wmf
            OleSavePictureFile(pic, filename);

            byte[] result = null;

            using (Image img = Image.FromFile(filename, true))
            {               
                result = ImageToByteArray(
                    img,
                    System.Drawing.Imaging.ImageFormat.Png);
            }

            System.IO.File.Delete(filename);

            return result;
        }

        byte[] ImageToByteArray(
            System.Drawing.Image imageIn,
            System.Drawing.Imaging.ImageFormat format)
        {
            byte[] res = null;

            using (MemoryStream ms = new MemoryStream())
            {
                imageIn.Save(ms, format);

                res = ms.ToArray();

                ms.Close();
            }

            return res;
        }
    }
}
