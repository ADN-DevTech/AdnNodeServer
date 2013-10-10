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
using System.Diagnostics;
using System.Runtime.InteropServices;

using Inventor;

namespace WorkerApp
{
    class ApplicationWrapper : IDisposable
    {
        private ApplicationWrapper()
        {
            Server = new ApprenticeServerComponent();
        }

        public void Dispose()
        {
            lock (this)
            {
                try
                {
                    if (Server != null)
                    {
                        Server.Close();
                        Marshal.ReleaseComObject(Server);

                        Server = null;
                    }
                }
                catch
                {
                }
                finally
                {
                    Server = null;
                }
            }
        }

        public ApprenticeServerComponent Server 
        { 
            get; 
            private set; 
        }

        public static ApplicationWrapper Create()
        {           
            ApplicationWrapper app = new ApplicationWrapper();

            return app;
        }
    }
}
