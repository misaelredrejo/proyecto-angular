USE [master]
GO
/****** Object:  Database [ComentarioDB]    Script Date: 10/06/2021 9:15:23 ******/
CREATE DATABASE [ComentarioDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'ComentarioDB', FILENAME = N'C:\Users\mredrejo-ext\ComentarioDB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'ComentarioDB_log', FILENAME = N'C:\Users\mredrejo-ext\ComentarioDB_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [ComentarioDB] SET COMPATIBILITY_LEVEL = 130
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [ComentarioDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [ComentarioDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [ComentarioDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [ComentarioDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [ComentarioDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [ComentarioDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [ComentarioDB] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [ComentarioDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [ComentarioDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [ComentarioDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [ComentarioDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [ComentarioDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [ComentarioDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [ComentarioDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [ComentarioDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [ComentarioDB] SET  ENABLE_BROKER 
GO
ALTER DATABASE [ComentarioDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [ComentarioDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [ComentarioDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [ComentarioDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [ComentarioDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [ComentarioDB] SET READ_COMMITTED_SNAPSHOT ON 
GO
ALTER DATABASE [ComentarioDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [ComentarioDB] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [ComentarioDB] SET  MULTI_USER 
GO
ALTER DATABASE [ComentarioDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [ComentarioDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [ComentarioDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [ComentarioDB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [ComentarioDB] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [ComentarioDB] SET QUERY_STORE = OFF
GO
USE [ComentarioDB]
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET MAXDOP = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET LEGACY_CARDINALITY_ESTIMATION = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET PARAMETER_SNIFFING = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET QUERY_OPTIMIZER_HOTFIXES = PRIMARY;
GO
USE [ComentarioDB]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 10/06/2021 9:15:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Comment]    Script Date: 10/06/2021 9:15:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Comment](
	[CommentId] [int] IDENTITY(1,1) NOT NULL,
	[Path] [nvarchar](max) NOT NULL,
	[Text] [nvarchar](max) NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_Comment] PRIMARY KEY CLUSTERED 
(
	[CommentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Log]    Script Date: 10/06/2021 9:15:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Log](
	[LogId] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Date] [datetime2](7) NOT NULL,
	[Action] [int] NOT NULL,
	[CommentId] [int] NOT NULL,
	[CommentText] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Log] PRIMARY KEY CLUSTERED 
(
	[LogId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[User]    Script Date: 10/06/2021 9:15:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](max) NULL,
	[Rol] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[UserLog]    Script Date: 10/06/2021 9:15:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserLog](
	[UserLogId] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NULL,
	[LogId] [int] NULL,
 CONSTRAINT [PK_UserLog] PRIMARY KEY CLUSTERED 
(
	[UserLogId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Index [IX_Log_CommentId]    Script Date: 10/06/2021 9:15:23 ******/
CREATE NONCLUSTERED INDEX [IX_Log_CommentId] ON [dbo].[Log]
(
	[CommentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Log_UserId]    Script Date: 10/06/2021 9:15:23 ******/
CREATE NONCLUSTERED INDEX [IX_Log_UserId] ON [dbo].[Log]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserLog_LogId]    Script Date: 10/06/2021 9:15:23 ******/
CREATE NONCLUSTERED INDEX [IX_UserLog_LogId] ON [dbo].[UserLog]
(
	[LogId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserLog_UserId]    Script Date: 10/06/2021 9:15:23 ******/
CREATE NONCLUSTERED INDEX [IX_UserLog_UserId] ON [dbo].[UserLog]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT ((0)) FOR [UserId]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT ((0)) FOR [CommentId]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT (N'') FOR [CommentText]
GO
ALTER TABLE [dbo].[Log]  WITH CHECK ADD  CONSTRAINT [FK_Log_Comment_CommentId] FOREIGN KEY([CommentId])
REFERENCES [dbo].[Comment] ([CommentId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Log] CHECK CONSTRAINT [FK_Log_Comment_CommentId]
GO
ALTER TABLE [dbo].[Log]  WITH CHECK ADD  CONSTRAINT [FK_Log_User_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([UserId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Log] CHECK CONSTRAINT [FK_Log_User_UserId]
GO
ALTER TABLE [dbo].[UserLog]  WITH CHECK ADD  CONSTRAINT [FK_UserLog_Log_LogId] FOREIGN KEY([LogId])
REFERENCES [dbo].[Log] ([LogId])
GO
ALTER TABLE [dbo].[UserLog] CHECK CONSTRAINT [FK_UserLog_Log_LogId]
GO
ALTER TABLE [dbo].[UserLog]  WITH CHECK ADD  CONSTRAINT [FK_UserLog_User_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([UserId])
GO
ALTER TABLE [dbo].[UserLog] CHECK CONSTRAINT [FK_UserLog_User_UserId]
GO
/****** Object:  StoredProcedure [dbo].[CommentLogsFilter]    Script Date: 10/06/2021 9:15:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[CommentLogsFilter]
	@Username nvarchar(50),
	@Action INT,
	@StartDate date,
	@EndDate date
	-- Add the parameters for the stored procedure here
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	
	SET NOCOUNT ON;
	-- Insert statements for procedure here
	IF @Username IS NULL AND @Action IS NULL
		SELECT ComentarioDB.dbo.Log.CommentText, ComentarioDB.dbo.Comment.Path, ComentarioDB.dbo.Log.Date, ComentarioDB.dbo.Log.Action, ComentarioDB.dbo.[User].Username
		FROM ((ComentarioDB.dbo.Comment
		INNER JOIN ComentarioDB.dbo.Log ON ComentarioDB.dbo.Comment.CommentId = ComentarioDB.dbo.Log.CommentId)
		INNER JOIN ComentarioDB.dbo.[User] ON ComentarioDB.dbo.Log.UserId = ComentarioDB.dbo.[User].UserId)
		WHERE 
		@StartDate <= convert(date ,ComentarioDB.dbo.Log.Date) AND
		@EndDate >= convert(date ,ComentarioDB.dbo.Log.Date)
		ORDER BY ComentarioDB.dbo.Log.LogId DESC;
	ELSE IF @Username IS NULL
		SELECT ComentarioDB.dbo.Log.CommentText, ComentarioDB.dbo.Comment.Path, ComentarioDB.dbo.Log.Date, ComentarioDB.dbo.Log.Action, ComentarioDB.dbo.[User].Username
		FROM ((ComentarioDB.dbo.Comment
		INNER JOIN ComentarioDB.dbo.Log ON ComentarioDB.dbo.Comment.CommentId = ComentarioDB.dbo.Log.CommentId)
		INNER JOIN ComentarioDB.dbo.[User] ON ComentarioDB.dbo.Log.UserId = ComentarioDB.dbo.[User].UserId)
		WHERE 
		@Action = ComentarioDB.dbo.Log.Action AND
		@StartDate <= convert(date ,ComentarioDB.dbo.Log.Date) AND
		@EndDate >= convert(date ,ComentarioDB.dbo.Log.Date)
		ORDER BY ComentarioDB.dbo.Log.LogId DESC;
	ELSE IF @Action IS NULL
		SELECT ComentarioDB.dbo.Log.CommentText, ComentarioDB.dbo.Comment.Path, ComentarioDB.dbo.Log.Date, ComentarioDB.dbo.Log.Action, ComentarioDB.dbo.[User].Username
		FROM ((ComentarioDB.dbo.Comment
		INNER JOIN ComentarioDB.dbo.Log ON ComentarioDB.dbo.Comment.CommentId = ComentarioDB.dbo.Log.CommentId)
		INNER JOIN ComentarioDB.dbo.[User] ON ComentarioDB.dbo.Log.UserId = ComentarioDB.dbo.[User].UserId)
		WHERE 
		LOWER(@Username) = LOWER(ComentarioDB.dbo.[User].Username) AND
		@StartDate <= convert(date ,ComentarioDB.dbo.Log.Date) AND
		@EndDate >= convert(date ,ComentarioDB.dbo.Log.Date)
		ORDER BY ComentarioDB.dbo.Log.LogId DESC;
	ELSE
		SELECT ComentarioDB.dbo.Log.CommentText, ComentarioDB.dbo.Comment.Path, ComentarioDB.dbo.Log.Date, ComentarioDB.dbo.Log.Action, ComentarioDB.dbo.[User].Username
		FROM ((ComentarioDB.dbo.Comment
		INNER JOIN ComentarioDB.dbo.Log ON ComentarioDB.dbo.Comment.CommentId = ComentarioDB.dbo.Log.CommentId)
		INNER JOIN ComentarioDB.dbo.[User] ON ComentarioDB.dbo.Log.UserId = ComentarioDB.dbo.[User].UserId)
		WHERE 
		LOWER(@Username) = LOWER(ComentarioDB.dbo.[User].Username) AND
		@Action = ComentarioDB.dbo.Log.Action AND
		@StartDate <= convert(date ,ComentarioDB.dbo.Log.Date) AND
		@EndDate >= convert(date ,ComentarioDB.dbo.Log.Date)
		ORDER BY ComentarioDB.dbo.Log.LogId DESC;
    
	
END
GO
/****** Object:  StoredProcedure [dbo].[LastNLogs]    Script Date: 10/06/2021 9:15:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Name
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[LastNLogs] @NumberRows INT = null 
	-- Add the parameters for the stored procedure here
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	IF @NumberRows IS NULL
		SELECT ComentarioDB.dbo.Log.CommentText, ComentarioDB.dbo.Comment.Path, ComentarioDB.dbo.Log.Date, ComentarioDB.dbo.Log.Action, ComentarioDB.dbo.[User].Username
		FROM ((ComentarioDB.dbo.Comment
		INNER JOIN ComentarioDB.dbo.Log ON ComentarioDB.dbo.Comment.CommentId = ComentarioDB.dbo.Log.CommentId)
		INNER JOIN ComentarioDB.dbo.[User] ON ComentarioDB.dbo.Log.UserId = ComentarioDB.dbo.[User].UserId)
		ORDER BY ComentarioDB.dbo.Log.LogId DESC;
	ELSE
		SELECT TOP(@NumberRows) ComentarioDB.dbo.Log.CommentText, ComentarioDB.dbo.Comment.Path, ComentarioDB.dbo.Log.Date, ComentarioDB.dbo.Log.Action, ComentarioDB.dbo.[User].Username
		FROM ((ComentarioDB.dbo.Comment
		INNER JOIN ComentarioDB.dbo.Log ON ComentarioDB.dbo.Comment.CommentId = ComentarioDB.dbo.Log.CommentId)
		INNER JOIN ComentarioDB.dbo.[User] ON ComentarioDB.dbo.Log.UserId = ComentarioDB.dbo.[User].UserId)
		ORDER BY ComentarioDB.dbo.Log.LogId DESC;
END

GO
USE [master]
GO
ALTER DATABASE [ComentarioDB] SET  READ_WRITE 
GO
