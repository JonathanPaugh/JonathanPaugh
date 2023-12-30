using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using JapeHttp;
using JapeService;
using JapeWeb;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace JonathanPaugh
{
    public class WebServer : JapeWeb.WebServer
    {
        private Templater templates;

        private const bool DEBUG = false;

        #if DEBUG
        protected override bool Caching => false;
        #endif

        public WebServer(int http, int https, ListenerSettings settings) : base(http, https, settings) {} 
        
        protected override IEnumerator<WebComponent> Components() {
            templates = CreateTemplater("./template");
            PathString templatesRequestPath = "/template";
            yield return Route(templatesRequestPath, 
                               "./template", 
                               async request => await ResponseTemplate(request, templatesRequestPath));

            // yield return MapPost("/resume", "./private/JonathanPaugh.pdf", Encoding.UTF8, ReadServerBinary);

            if (DEBUG)
            {
                yield return Use(ResponseConstantsDebug);
            }
        }

        protected override void Setup(IApplicationBuilder app)
        {
            app.UseHttpsRedirection();
        }

        private async Task<Middleware.Result> ResponseConstantsDebug(Middleware.Request request)
        {
            if (request.Path.Value.Contains("constants.js"))
            {
                string data = await ReadStaticFileAsync("js/constants.js");
                return await request.Complete(Status.SuccessCode.Ok, data.Replace("false", "true"));
            }

            return request.Next();
        }

        private async Task<Middleware.Result> ResponseTemplate(Middleware.Request request, PathString requestPath)
        {
            request.Path.StartsWithSegments(requestPath, out PathString remainingPath);
            string file = await templates.ReadFileAsync($".{remainingPath}");
            return await request.Complete(Status.SuccessCode.Ok, file);
        }

    }
}
