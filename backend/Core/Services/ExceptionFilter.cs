using Bakalauras.Core.DTOs;
using Bakalauras.Exceptions;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;

namespace Bakalauras.Core.Services
{
    public class ExceptionFilter : IExceptionFilter
    {
        public async void OnException(ExceptionContext context)
        {
            context.ExceptionHandled = true;

            var exceptionDto = HandleException(context.Exception);

            context.HttpContext.Response.ContentType = "application/json";
            context.HttpContext.Response.StatusCode = exceptionDto.StatusCode;

            await context.HttpContext.Response.WriteAsync(exceptionDto.ToString());
        }

        private static ExceptionDto HandleException(Exception exception)
        {
            HttpStatusCode httpStatusCode;

            switch (exception)
            {
                case NotFoundException:
                    httpStatusCode = HttpStatusCode.NotFound;
                    break;
                case ForbiddenException:
                    httpStatusCode = HttpStatusCode.Forbidden;
                    break;
                default:
                    httpStatusCode = HttpStatusCode.InternalServerError;
                    break;
            }

            var exceptionDto = new ExceptionDto
            {
                StatusCode = (int)httpStatusCode,
                Message = exception.Message,
                StackTrace = exception.StackTrace,
                Source = exception.Source,
                HelpLink = exception.HelpLink,
                HResult = exception.HResult
            };
            return exceptionDto;
        }
    }
}
