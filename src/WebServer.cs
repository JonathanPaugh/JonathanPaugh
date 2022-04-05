using System.Collections.Generic;
using System.Threading.Tasks;
using JapeCore;
using JapeHttp;
using JapeWeb;
using Microsoft.AspNetCore.Http;

namespace JonathanPaugh
{
    public class WebServer : JapeWeb.WebServer
    {
        private Templater templates;

        public WebServer(int http, int https) : base(http, https) {} 
        
        protected override IEnumerator<WebComponent> Components() {
            templates = CreateTemplater("./template");
            PathString templatesRequestPath = "/template"; 
            yield return Route(templatesRequestPath, "./template", async request => await ResponseTemplate(request, templatesRequestPath));
        }

        private async Task<Middleware.Result> ResponseTemplate(Middleware.Request request, PathString requestPath)
        {
            if (request.GetMethod() == Request.Method.Get)
            {
                Log.Write($"Template Get Request: {requestPath}");
            }

            request.Path.StartsWithSegments(requestPath, out PathString remainingPath);
            string file = await templates.ReadFileAsync($".{remainingPath}");
            return await request.Complete(Status.SuccessCode.Ok, file);
        }

    }
}
