namespace Bakalauras.Core.DTOs
{
    public class ExceptionDto
    {
        public required int StatusCode { get; set; }
        public required string Message { get; set; }
        public string? StackTrace { get; set; }
        public string? Source { get; set; }
        public string? HelpLink { get; set; }
        public required int HResult { get; set; }

        public override string ToString()
        {
            return System.Text.Json.JsonSerializer.Serialize(this);
        }
    }
} 