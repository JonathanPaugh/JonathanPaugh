using System;
using System.Globalization;
using System.IO;
using System.Threading.Tasks;
using JapeCore;
using JapeService;

namespace WebServer
{
    internal class Program : ConsoleProgram
    {
        protected override string DefaultLog => "server.log";

        private int http;
        private int https;
        private string ssl;
        
        private static async Task Main(string[] args) => await RunAsync<Program>(args);

        protected override ICommandArg[] Args() => Service.Args;

        protected override void OnSetup(ArgParser parser)
        {
            parser.Parse(Service.ArgHttp, out http);
            parser.Parse(Service.ArgHttps, out https);
            parser.Parse(Service.ArgSsl, out ssl);
        }

        protected override async Task OnStartAsync()
        {
            SyncReload();
            Server server = new(
                http, 
                https,
                new ListenerSettings(ssl)
            );
            await server.Start();
        }

        private static void SyncReload()
        {
            #if DEBUG
            try
            {
                File.WriteAllText(".sync", DateTime.Now.ToString(CultureInfo.InvariantCulture));
            }
            catch
            { 
                Log.Write("Error: Sync File");
            }
            #endif
        }
    }
}