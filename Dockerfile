# Stage 1: Build & Publish
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project file và restore dependencies trước (tận dụng Docker layer cache)
COPY ["API app stt/API app stt.csproj", "API app stt/"]
RUN dotnet restore "API app stt/API app stt.csproj"

# Copy toàn bộ source code và build
COPY . .
WORKDIR "/src/API app stt"
RUN dotnet publish "API app stt.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Port mặc định cho ASP.NET Core (.NET 8+)
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "API app stt.dll"]
